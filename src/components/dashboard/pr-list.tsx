"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, GitPullRequest, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GitHubPullRequest } from "@/types/github";

interface PRListProps {
  pullRequests: GitHubPullRequest[];
}

function getStatusColor(pr: GitHubPullRequest) {
  if (pr.merged) return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
  if (pr.state === "open") return "bg-cactus-soft text-cactus border-cactus/20";
  return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
}

function getStatusText(pr: GitHubPullRequest) {
  if (pr.merged) return "Com Merge";
  if (pr.state === "open") return "Aberto";
  return "Fechado";
}

export function PRList({ pullRequests }: PRListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (pullRequests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GitPullRequest className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>Nenhum pull request encontrado neste período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pullRequests.map((pr) => (
        <Card
          key={pr.id}
          className="border border-border bg-card rounded-xl overflow-hidden hover:border-cactus/20 transition-all duration-200"
        >
          <button
            className="w-full p-4 text-left"
            onClick={() =>
              setExpandedId(expandedId === pr.id ? null : pr.id)
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GitPullRequest className="w-4 h-4 text-cactus shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">
                    {pr.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("rounded-full text-xs", getStatusColor(pr))}
                  >
                    {getStatusText(pr)}
                  </Badge>
                  <span>{pr.repo}</span>
                  <span>•</span>
                  <span>#{pr.number}</span>
                  <span>•</span>
                  <span>
                    {new Date(pr.created_at).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-cactus transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {expandedId === pr.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </button>

          {expandedId === pr.id && (
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
              {pr.body && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pr.body.substring(0, 500)}
                  {pr.body.length > 500 ? "..." : ""}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {pr.comments !== undefined && pr.comments > 0 && (
                  <span>{pr.comments} comentários</span>
                )}
                {pr.merged_at && (
                  <span>
                    Merge em{" "}
                    {new Date(pr.merged_at).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              {pr.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pr.labels.map((label) => (
                    <Badge
                      key={label.name}
                      variant="secondary"
                      className="rounded-full text-xs"
                      style={{
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                      }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
