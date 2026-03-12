import { Octokit } from "@octokit/rest";
import type { GitHubRepository } from "@/types/github";

export async function fetchRepositories(
  octokit: Octokit
): Promise<GitHubRepository[]> {
  const repos: GitHubRepository[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "pushed",
      direction: "desc",
      per_page: perPage,
      page,
    });

    if (data.length === 0) break;

    repos.push(
      ...data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description ?? null,
        html_url: repo.html_url,
        language: repo.language ?? null,
        stargazers_count: repo.stargazers_count ?? 0,
        forks_count: repo.forks_count ?? 0,
        open_issues_count: repo.open_issues_count ?? 0,
        private: repo.private,
        updated_at: repo.updated_at ?? "",
        pushed_at: repo.pushed_at ?? null,
        created_at: repo.created_at ?? "",
        default_branch: repo.default_branch,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
      }))
    );

    if (data.length < perPage) break;
    page++;
  }

  return repos;
}
