import { Octokit } from "@octokit/rest";
import type { GitHubRepository } from "@/types/github";

export async function fetchRepositories(
  octokit: Octokit,
): Promise<GitHubRepository[]> {
  const repos = await octokit.paginate(
    octokit.repos.listForAuthenticatedUser,
    {
      visibility: "all",
      affiliation: "owner,collaborator,organization_member",
      sort: "pushed",
      direction: "desc",
      per_page: 100,
    },
  );

  return repos.map((repo) => ({
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
  }));
}
