import { Octokit } from "@octokit/rest";
import type { GitHubUser, GitHubOrganization } from "@/types/github";

export async function fetchUser(octokit: Octokit): Promise<GitHubUser> {
  const { data } = await octokit.users.getAuthenticated();
  return {
    login: data.login,
    id: data.id,
    avatar_url: data.avatar_url,
    name: data.name ?? null,
    bio: data.bio ?? null,
    company: data.company ?? null,
    location: data.location ?? null,
    email: data.email ?? null,
    blog: data.blog ?? null,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
    created_at: data.created_at,
  };
}

export async function fetchOrganizations(
  octokit: Octokit
): Promise<GitHubOrganization[]> {
  const { data } = await octokit.orgs.listForAuthenticatedUser();
  return data.map((org) => ({
    login: org.login,
    id: org.id,
    avatar_url: org.avatar_url,
    description: org.description ?? null,
  }));
}
