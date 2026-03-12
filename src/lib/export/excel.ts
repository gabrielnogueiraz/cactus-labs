import * as XLSX from "xlsx";
import type { GitHubCommit, GitHubPullRequest } from "@/types/github";

export function exportCommitsToExcel(commits: GitHubCommit[], filename: string = "commits"): void {
  const data = commits.map((commit) => ({
    Repositório: commit.repo,
    Mensagem: commit.message,
    SHA: commit.sha.substring(0, 7),
    Autor: commit.author,
    Data: new Date(commit.date).toLocaleDateString("pt-BR"),
    URL: commit.html_url,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Commits");

  // Auto-size columns
  const maxWidth = data.reduce(
    (widths, row) => {
      Object.keys(row).forEach((key, i) => {
        const val = String(row[key as keyof typeof row]);
        widths[i] = Math.max(widths[i] || 10, val.length + 2);
      });
      return widths;
    },
    {} as Record<number, number>
  );

  ws["!cols"] = Object.values(maxWidth).map((w) => ({ wch: Math.min(w, 50) }));

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPullRequestsToExcel(
  pullRequests: GitHubPullRequest[],
  filename: string = "pull-requests"
): void {
  const data = pullRequests.map((pr) => ({
    Repositório: pr.repo,
    Título: pr.title,
    Status: pr.merged ? "Com Merge" : pr.state === "open" ? "Aberto" : "Fechado",
    "Criado Em": new Date(pr.created_at).toLocaleDateString("pt-BR"),
    "Merge Em": pr.merged_at
      ? new Date(pr.merged_at).toLocaleDateString("pt-BR")
      : "-",
    Comentários: pr.comments ?? 0,
    URL: pr.html_url,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pull Requests");

  const maxWidth = data.reduce(
    (widths, row) => {
      Object.keys(row).forEach((key, i) => {
        const val = String(row[key as keyof typeof row]);
        widths[i] = Math.max(widths[i] || 10, val.length + 2);
      });
      return widths;
    },
    {} as Record<number, number>
  );

  ws["!cols"] = Object.values(maxWidth).map((w) => ({ wch: Math.min(w, 50) }));

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
