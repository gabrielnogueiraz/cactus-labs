"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, GitCommitHorizontal } from "lucide-react";
import type { GitHubCommit } from "@/types/github";

interface CommitListProps {
  commits: GitHubCommit[];
}

export function CommitList({ commits }: CommitListProps) {
  if (commits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GitCommitHorizontal className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>Nenhum commit encontrado neste período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {commits.map((commit) => (
        <Card
          key={commit.sha}
          className="border border-border bg-card rounded-xl p-4 hover:border-cactus/20 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <GitCommitHorizontal className="w-4 h-4 text-cactus shrink-0" />
                <p className="text-sm font-medium text-foreground truncate">
                  {commit.message}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs font-mono"
                >
                  {commit.sha.substring(0, 7)}
                </Badge>
                <span>{commit.repo}</span>
                <span>•</span>
                <span>
                  {new Date(commit.date).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <a
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-cactus transition-colors shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
