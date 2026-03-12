import { Octokit } from "@octokit/rest";
import type { GitHubCommit } from "@/types/github";

export async function fetchCommits(
  octokit: Octokit,
  username: string,
  repos: Array<{ full_name: string; owner: { login: string } }>,
  since: string
): Promise<GitHubCommit[]> {
  const commits: GitHubCommit[] = [];

  const reposToFetch = repos.slice(0, 30); // Limit to 30 most recent repos

  const results = await Promise.allSettled(
    reposToFetch.map(async (repo) => {
      try {
        const [owner, repoName] = repo.full_name.split("/");
        const { data } = await octokit.repos.listCommits({
          owner,
          repo: repoName,
          author: username,
          since,
          per_page: 100,
        });

        return data.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message.split("\n")[0],
          date: commit.commit.author?.date ?? "",
          author: commit.commit.author?.name ?? username,
          repo: repo.full_name,
          html_url: commit.html_url,
          additions: 0,
          deletions: 0,
        }));
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      commits.push(...result.value);
    }
  }

  return commits.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
