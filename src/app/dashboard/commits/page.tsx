"use client";

import { useState, useMemo } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { CommitList } from "@/components/dashboard/commit-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { exportCommitsToExcel } from "@/lib/export/excel";
import type { TimePeriod } from "@/types/github";

export default function CommitsPage() {
  const { commits, repos, isLoading, period, setPeriod } = useGitHubData();
  const [search, setSearch] = useState("");
  const [repoFilter, setRepoFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filteredCommits = useMemo(() => {
    let filtered = commits;

    if (repoFilter !== "all") {
      filtered = filtered.filter((c) => c.repo === repoFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.message.toLowerCase().includes(query) ||
          c.repo.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [commits, repoFilter, search]);

  const paginatedCommits = filteredCommits.slice(0, page * perPage);
  const hasMore = paginatedCommits.length < filteredCommits.length;
  const repoNames = [...new Set(commits.map((c) => c.repo))];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Commits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredCommits.length} commits encontrados
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
            onClick={() => exportCommitsToExcel(filteredCommits)}
            disabled={filteredCommits.length === 0}
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar commits..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
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
          <CommitList commits={paginatedCommits} />
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
