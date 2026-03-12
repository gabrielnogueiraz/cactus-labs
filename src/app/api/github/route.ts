import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGitHubClient } from "@/lib/github/client";
import { fetchUser, fetchOrganizations } from "@/lib/github/user";
import { fetchRepositories } from "@/lib/github/repositories";
import { fetchCommits } from "@/lib/github/commits";
import { fetchPullRequests } from "@/lib/github/pull-requests";
import type { TimePeriod } from "@/types/github";

function getPeriodDate(period: TimePeriod): string {
  const now = new Date();
  switch (period) {
    case "7d":
      now.setDate(now.getDate() - 7);
      break;
    case "30d":
      now.setDate(now.getDate() - 30);
      break;
    case "90d":
      now.setDate(now.getDate() - 90);
      break;
    case "1y":
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now.toISOString();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") ?? "30d") as TimePeriod;

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.provider_token;
    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub token not found. Please re-authenticate." },
        { status: 401 }
      );
    }

    const octokit = createGitHubClient(accessToken);
    const since = getPeriodDate(period);

    const [user, orgs, repos] = await Promise.all([
      fetchUser(octokit),
      fetchOrganizations(octokit),
      fetchRepositories(octokit),
    ]);

    const [commits, pullRequests] = await Promise.all([
      fetchCommits(octokit, user.login, repos, since),
      fetchPullRequests(octokit, user.login, repos, since),
    ]);

    const activeRepos = new Set([
      ...commits.map((c) => c.repo),
      ...pullRequests.map((pr) => pr.repo),
    ]).size;

    const prsMerged = pullRequests.filter((pr) => pr.merged).length;
    const prsOpen = pullRequests.filter((pr) => pr.state === "open").length;

    return NextResponse.json({
      user,
      orgs,
      repos,
      commits,
      pullRequests,
      stats: {
        totalCommits: commits.length,
        prsMerged,
        prsOpen,
        activeRepos,
        reviewsDone: 0,
      },
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
