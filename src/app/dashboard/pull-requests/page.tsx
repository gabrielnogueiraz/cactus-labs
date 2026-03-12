"use client";

import { useState, useMemo } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { PRList } from "@/components/dashboard/pr-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { exportPullRequestsToExcel } from "@/lib/export/excel";
import type { TimePeriod } from "@/types/github";

export default function PullRequestsPage() {
  const { pullRequests, isLoading, period, setPeriod } = useGitHubData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [repoFilter, setRepoFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filteredPRs = useMemo(() => {
    let filtered = pullRequests;

    if (statusFilter !== "all") {
      if (statusFilter === "merged") {
        filtered = filtered.filter((pr) => pr.merged);
      } else if (statusFilter === "open") {
        filtered = filtered.filter(
          (pr) => pr.state === "open" && !pr.merged
        );
      } else if (statusFilter === "closed") {
        filtered = filtered.filter(
          (pr) => pr.state === "closed" && !pr.merged
        );
      }
    }

    if (repoFilter !== "all") {
      filtered = filtered.filter((pr) => pr.repo === repoFilter);
    }

    return filtered;
  }, [pullRequests, statusFilter, repoFilter]);

  const paginatedPRs = filteredPRs.slice(0, page * perPage);
  const hasMore = paginatedPRs.length < filteredPRs.length;
  const repoNames = [...new Set(pullRequests.map((pr) => pr.repo))];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pull Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredPRs.length} pull requests encontrados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={period}
            onValueChange={(v) => v && setPeriod(v as TimePeriod)}
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
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => exportPullRequestsToExcel(filteredPRs)}
            disabled={filteredPRs.length === 0}
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            const next = value ?? "all";
            setStatusFilter(next);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="open">Abertos</SelectItem>
            <SelectItem value="merged">Com Merge</SelectItem>
            <SelectItem value="closed">Fechados</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={repoFilter}
          onValueChange={(value) => {
            const next = value ?? "all";
            setRepoFilter(next);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Todos os repositórios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os repositórios</SelectItem>
            {repoNames.map((repo) => (
              <SelectItem key={repo} value={repo}>
                {repo.split("/").pop()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <PRList pullRequests={paginatedPRs} />
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl"
              >
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
