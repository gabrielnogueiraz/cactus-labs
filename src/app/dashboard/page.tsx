"use client";

import { useGitHubData } from "@/hooks/use-github-data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ContributionHeatmap } from "@/components/dashboard/contribution-heatmap";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  FolderGit2,
  Eye,
} from "lucide-react";
import type { TimePeriod } from "@/types/github";

export default function DashboardOverview() {
  const { stats, commits, pullRequests, isLoading, error, period, setPeriod } =
    useGitHubData();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-destructive text-sm mb-2">Falha ao carregar dados</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumo da sua atividade no GitHub
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value) => value && setPeriod(value as TimePeriod)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            label="Total de Commits"
            value={stats.totalCommits}
            icon={GitCommitHorizontal}
            description="Neste período"
          />
          <StatsCard
            label="PRs com Merge"
            value={stats.prsMerged}
            icon={GitMerge}
            description="Merges bem-sucedidos"
          />
          <StatsCard
            label="PRs Abertos"
            value={stats.prsOpen}
            icon={GitPullRequest}
            description="Abertos atualmente"
          />
          <StatsCard
            label="Repositórios Ativos"
            value={stats.activeRepos}
            icon={FolderGit2}
            description="Com atividade"
          />
          <StatsCard
            label="Revisões"
            value={stats.reviewsDone}
            icon={Eye}
            description="Revisões de código"
          />
        </div>
      )}

      {/* Charts */}
      {isLoading ? (
        <Skeleton className="h-[350px] rounded-xl" />
      ) : (
        <ActivityChart commits={commits} pullRequests={pullRequests} />
      )}

      {/* Heatmap */}
      {isLoading ? (
        <Skeleton className="h-[200px] rounded-xl" />
      ) : (
        <ContributionHeatmap commits={commits} />
      )}
    </div>
  );
}
