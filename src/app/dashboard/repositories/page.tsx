"use client";

import { useMemo, useState } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { RepoCard } from "@/components/dashboard/repo-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function RepositoriesPage() {
  const { repos, isLoading } = useGitHubData();
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated");

  const filteredRepos = useMemo(() => {
    let filtered = repos;

    if (languageFilter !== "all") {
      filtered = filtered.filter((r) => r.language === languageFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "stars":
        filtered = [...filtered].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }

    return filtered;
  }, [repos, languageFilter, search, sortBy]);

  const languages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ] as string[];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Repositórios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredRepos.length} repositórios
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar repositórios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={languageFilter} onValueChange={(v) => v && setLanguageFilter(v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Todas as linguagens" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as linguagens</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as "updated" | "stars" | "name")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Atualizado recentemente</SelectItem>
            <SelectItem value="stars">Mais estrelas</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
