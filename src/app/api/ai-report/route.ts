import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGitHubClient } from "@/lib/github/client";
import { fetchUser } from "@/lib/github/user";
import { fetchRepositories } from "@/lib/github/repositories";
import { fetchCommits } from "@/lib/github/commits";
import { fetchPullRequests } from "@/lib/github/pull-requests";
import { analyzePerformance } from "@/lib/groq/analyze";
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

function getPeriodLabel(period: TimePeriod): string {
  switch (period) {
    case "7d":
      return "Últimos 7 dias";
    case "30d":
      return "Últimos 30 dias";
    case "90d":
      return "Últimos 90 dias";
    case "1y":
      return "Último ano";
  }
}

export async function POST(request: Request) {
  try {
    const { period = "30d" } = (await request.json()) as {
      period?: TimePeriod;
    };

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
        { error: "GitHub token not found" },
        { status: 401 }
      );
    }

    const octokit = createGitHubClient(accessToken);
    const since = getPeriodDate(period);

    const [user, repos] = await Promise.all([
      fetchUser(octokit),
      fetchRepositories(octokit),
    ]);

    const [commits, pullRequests] = await Promise.all([
      fetchCommits(octokit, user.login, repos, since),
      fetchPullRequests(octokit, user.login, repos, since),
    ]);

    const report = await analyzePerformance(
      commits,
      pullRequests,
      getPeriodLabel(period),
      user.login,
    );

    return NextResponse.json({ report });
  } catch (error) {
    console.error("AI report error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI report" },
      { status: 500 }
    );
  }
}
