import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { GitHubRepository } from "@/types/github";

interface RepoCardProps {
  repo: GitHubRepository;
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  Ruby: "#CC342D",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#4FC08D",
  CSS: "#563D7C",
  HTML: "#E34C26",
  Shell: "#89E051",
};

function getActivityLevel(repo: GitHubRepository): string {
  if (!repo.pushed_at) return "Inativo";
  const daysSincePush = Math.floor(
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSincePush <= 7) return "Muito Ativo";
  if (daysSincePush <= 30) return "Ativo";
  if (daysSincePush <= 90) return "Moderado";
  return "Baixa Atividade";
}

function getActivityColor(level: string): string {
  switch (level) {
    case "Muito Ativo":
      return "bg-cactus-soft text-cactus border-cactus/20";
    case "Ativo":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "Moderado":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

export function RepoCard({ repo }: RepoCardProps) {
  const activity = getActivityLevel(repo);
  const langColor = repo.language
    ? languageColors[repo.language] || "#6B7280"
    : "#6B7280";

  return (
    <Card className="border border-border bg-card rounded-xl hover:border-cactus/20 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-cactus transition-colors inline-flex items-center gap-1.5 group-hover:gap-2"
            >
              {repo.name}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {repo.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
          </div>
          {repo.private && (
            <Badge variant="outline" className="rounded-full text-xs ml-2 shrink-0">
              Privado
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {repo.forks_count}
            </span>
          )}
          <Badge
            variant="outline"
            className={`rounded-full text-xs ${getActivityColor(activity)}`}
          >
            {activity}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
