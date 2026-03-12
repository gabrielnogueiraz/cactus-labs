"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  GitHubUser,
  GitHubRepository,
  GitHubCommit,
  GitHubPullRequest,
  DashboardStats,
  TimePeriod,
} from "@/types/github";

interface GitHubData {
  user: GitHubUser | null;
  repos: GitHubRepository[];
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  period: TimePeriod;
  setPeriod: (period: TimePeriod) => void;
  refresh: () => void;
}

export function useGitHubData(): GitHubData {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCommits: 0,
    prsMerged: 0,
    prsOpen: 0,
    activeRepos: 0,
    reviewsDone: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>("30d");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github?period=${period}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch data");
      }

      const data = await response.json();
      setUser(data.user);
      setRepos(data.repos);
      setCommits(data.commits);
      setPullRequests(data.pullRequests);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    repos,
    commits,
    pullRequests,
    stats,
    isLoading,
    error,
    period,
    setPeriod,
    refresh: fetchData,
  };
}
