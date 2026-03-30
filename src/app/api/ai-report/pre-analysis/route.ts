import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGitHubClient } from "@/lib/github/client";
import { fetchUser } from "@/lib/github/user";
import { fetchRepositories } from "@/lib/github/repositories";
import { fetchCommits } from "@/lib/github/commits";
import { fetchPullRequests } from "@/lib/github/pull-requests";
import { generateBragQuestions } from "@/lib/groq/analyze";
import { getPeriodDate, getPeriodLabel } from "@/lib/github/utils";
import type { TimePeriod } from "@/types/github";

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
      fetchCommits(octokit, user.login, since, repos),
      fetchPullRequests(octokit, user.login, repos, since),
    ]);

    const preAnalysis = await generateBragQuestions(
      commits,
      pullRequests,
      getPeriodLabel(period),
      user.login,
    );

    return NextResponse.json({ preAnalysis });
  } catch (error) {
    console.error("Pre-analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate pre-analysis questions" },
      { status: 500 }
    );
  }
}
