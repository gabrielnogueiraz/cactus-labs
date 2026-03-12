import { Octokit } from "@octokit/rest";
import type { GitHubPullRequest } from "@/types/github";

export async function fetchPullRequests(
  octokit: Octokit,
  username: string,
  repos: Array<{ full_name: string }>,
  since: string
): Promise<GitHubPullRequest[]> {
  const pullRequests: GitHubPullRequest[] = [];

  const reposToFetch = repos.slice(0, 30);

  const results = await Promise.allSettled(
    reposToFetch.map(async (repo) => {
      try {
        const [owner, repoName] = repo.full_name.split("/");
        const { data } = await octokit.pulls.list({
          owner,
          repo: repoName,
          state: "all",
          sort: "updated",
          direction: "desc",
          per_page: 50,
        });

        const sinceDate = new Date(since);

        return data
          .filter(
            (pr) =>
              pr.user?.login === username &&
              new Date(pr.created_at) >= sinceDate
          )
          .map((pr) => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            body: pr.body ?? null,
            state: pr.state as "open" | "closed",
            merged: pr.merged_at !== null,
            html_url: pr.html_url,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            closed_at: pr.closed_at ?? null,
            merged_at: pr.merged_at ?? null,
            repo: repo.full_name,
            user: {
              login: pr.user?.login ?? "",
              avatar_url: pr.user?.avatar_url ?? "",
            },
            labels: pr.labels.map((label) => ({
              name: typeof label === "string" ? label : label.name ?? "",
              color: typeof label === "string" ? "gray" : label.color ?? "gray",
            })),
            changed_files: 0,
            additions: 0,
            deletions: 0,
            comments: 0,
          }));
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      pullRequests.push(...result.value);
    }
  }

  return pullRequests.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
