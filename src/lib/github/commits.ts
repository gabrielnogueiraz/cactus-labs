import { Octokit } from "@octokit/rest";
import type { GitHubCommit } from "@/types/github";

export async function checkRateLimit(octokit: Octokit) {
  const { data } = await octokit.rateLimit.get();
  const remaining = data.rate.remaining;

  if (remaining < 100) {
    const resetTime = new Date(data.rate.reset * 1000);
    throw new Error(
      `Rate limit baixo: ${remaining} requests restantes. Reset em: ${resetTime.toLocaleTimeString()}`
    );
  }
}

export async function getAllRepositories(octokit: Octokit, username: string) {
  const personalRepos = await octokit.paginate(
    octokit.repos.listForAuthenticatedUser,
    {
      visibility: "all",
      affiliation: "owner,collaborator,organization_member",
      per_page: 100,
    },
  );

  let orgRepos: Awaited<
    ReturnType<typeof octokit.repos.listForOrg>
  >["data"][] = [];

  try {
    const orgs = await octokit.paginate(
      octokit.orgs.listForAuthenticatedUser,
      { per_page: 100 },
    );

    const results = await Promise.allSettled(
      orgs.map((org) =>
        octokit.paginate(octokit.repos.listForOrg, {
          org: org.login,
          type: "all",
          per_page: 100,
        }),
      ),
    );

    orgRepos = results
      .filter(
        (r): r is PromiseFulfilledResult<(typeof orgRepos)[number]> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);
  } catch {
    // If org fetching fails entirely (permissions), fall back to personal repos only
  }

  const allRepos = [...personalRepos, ...orgRepos.flat()];

  return Array.from(
    new Map(allRepos.map((repo) => [repo.id, repo])).values(),
  );
}

export async function fetchCommits(
  octokit: Octokit,
  username: string,
  since: string,
  preFetchedRepos?: any[],
): Promise<GitHubCommit[]> {
  await checkRateLimit(octokit);

  const repos = preFetchedRepos || (await getAllRepositories(octokit, username));

  // Fetch commits from all repos in parallel (batched)
  const BATCH_SIZE = 10;
  const allCommits: GitHubCommit[] = [];

  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async (repo) => {
        const commits = await octokit.paginate(octokit.repos.listCommits, {
          owner: repo.owner.login,
          repo: repo.name,
          author: username,
          since,
          per_page: 100,
        });

        return commits.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message?.split("\n")[0] ?? "",
          date: commit.commit.author?.date ?? "",
          author: commit.commit.author?.name ?? username,
          repo: repo.full_name,
          html_url: commit.html_url,
          additions: 0,
          deletions: 0,
        }));
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allCommits.push(...result.value);
      }
    }
  }

  // Deduplicate by SHA
  const unique = Array.from(
    new Map(allCommits.map((c) => [c.sha, c])).values(),
  );

  return unique.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
