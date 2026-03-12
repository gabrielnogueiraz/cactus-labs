"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubCommit, GitHubPullRequest } from "@/types/github";

interface ActivityChartProps {
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
}

function aggregateByDate(
  commits: GitHubCommit[],
  pullRequests: GitHubPullRequest[]
) {
  const dateMap = new Map<string, { commits: number; pullRequests: number }>();

  commits.forEach((commit) => {
    const date = new Date(commit.date).toISOString().split("T")[0];
    const existing = dateMap.get(date) || { commits: 0, pullRequests: 0 };
    existing.commits += 1;
    dateMap.set(date, existing);
  });

  pullRequests.forEach((pr) => {
    const date = new Date(pr.created_at).toISOString().split("T")[0];
    const existing = dateMap.get(date) || { commits: 0, pullRequests: 0 };
    existing.pullRequests += 1;
    dateMap.set(date, existing);
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      displayDate: new Date(date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
      }),
      commits: data.commits,
      pullRequests: data.pullRequests,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function ActivityChart({ commits, pullRequests }: ActivityChartProps) {
  const data = aggregateByDate(commits, pullRequests);

  return (
    <Card className="border border-border bg-card rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Histórico de Atividade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#86EFAC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#86EFAC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "13px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stackId="1"
                stroke="#16A34A"
                strokeWidth={2}
                fill="url(#colorCommits)"
                name="Commits"
              />
              <Area
                type="monotone"
                dataKey="pullRequests"
                stackId="1"
                stroke="#86EFAC"
                strokeWidth={2}
                fill="url(#colorPRs)"
                name="Pull Requests"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
