"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { GitHubCommit } from "@/types/github";

interface ContributionHeatmapProps {
  commits: GitHubCommit[];
}

function buildHeatmapData(commits: GitHubCommit[]) {
  const countByDate = new Map<string, number>();

  commits.forEach((commit) => {
    const date = new Date(commit.date).toISOString().split("T")[0];
    countByDate.set(date, (countByDate.get(date) || 0) + 1);
  });

  const today = new Date();
  const weeks: Array<Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>> = [];

  // Go back 52 weeks
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentWeek: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];

  for (
    let d = new Date(startDate);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    const count = countByDate.get(dateStr) || 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 10) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    currentWeek.push({ date: dateStr, count, level });

    if (d.getDay() === 6 || d.getTime() >= today.getTime()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

const levelColors = {
  0: "bg-secondary dark:bg-secondary",
  1: "bg-chart-5 dark:bg-chart-5",
  2: "bg-chart-3 dark:bg-chart-3",
  3: "bg-chart-2 dark:bg-chart-2",
  4: "bg-chart-1 dark:bg-chart-1",
};

const dayLabels = ["", "Seg", "", "Qua", "", "Sex", ""];

export function ContributionHeatmap({ commits }: ContributionHeatmapProps) {
  const weeks = buildHeatmapData(commits);

  return (
    <Card className="border border-border bg-card rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Atividade de Contribuições
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] min-w-fit">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2">
              {dayLabels.map((label, i) => (
                <div
                  key={i}
                  className="w-4 h-[13px] flex items-center text-[10px] text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger
                      render={<div />}
                      className={cn(
                        "w-[13px] h-[13px] rounded-[2px] transition-colors duration-200",
                        levelColors[day.level]
                      )}
                    />
                    <TooltipContent
                      side="top"
                      className="text-xs"
                    >
                      <p className="font-medium">
                        {day.count} contribuição(ões) em{" "}
                        {new Date(day.date).toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className={cn("w-[13px] h-[13px] rounded-[2px]", levelColors[level])}
            />
          ))}
          <span>Mais</span>
        </div>
      </CardContent>
    </Card>
  );
}
