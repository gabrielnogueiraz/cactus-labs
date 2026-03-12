"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BrainCircuit,
  Download,
  Loader2,
  Sparkles,
  BarChart3,
  Code2,
  Target,
  TrendingUp,
} from "lucide-react";
import type { AIReportData, TimePeriod } from "@/types/github";
import { generateReportPDF } from "@/lib/export/pdf";

export default function AIReportPage() {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const [report, setReport] = useState<AIReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao gerar relatório");
      }

      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;
    const periodLabels: Record<TimePeriod, string> = {
      "7d": "Últimos 7 dias",
      "30d": "Últimos 30 dias",
      "90d": "Últimos 90 dias",
      "1y": "Último ano",
    };
    const blob = await generateReportPDF(
      report,
      periodLabels[period],
      "Developer"
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cactus-labs-report-${period}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cactus" />
            Relatório de IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Obtenha uma análise da sua performance no GitHub feita por IA
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card className="border border-border bg-card rounded-xl">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                Selecione o período de análise
              </p>
              <p className="text-xs text-muted-foreground">
                A IA analisará seus commits e PRs deste período
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={period}
                onValueChange={(v) => v && setPeriod(v as TimePeriod)}
              >
                <SelectTrigger className="w-40">
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
                onClick={generateReport}
                disabled={isLoading}
                className="bg-cactus hover:bg-cactus/90 text-cactus-foreground gap-2 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isLoading ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border border-destructive/20 bg-destructive/5 rounded-xl">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading animation */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cactus/20 rounded-full" />
            <div className="w-16 h-16 border-4 border-cactus border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Analisando seu código...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A IA está revisando seus commits e pull requests
            </p>
          </div>
        </div>
      )}

      {/* Report Output */}
      {report && !isLoading && (
        <div className="space-y-6">
          {/* Export button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2 rounded-xl"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-cactus">
                  {report.metrics.total_commits}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Commits</p>
              </CardContent>
            </Card>
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-cactus">
                  {report.metrics.total_prs}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pull Requests
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-cactus">
                  {report.metrics.repos_contributed}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Repositórios</p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="border border-border bg-card rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cactus" />
                <h3 className="text-lg font-semibold text-foreground">
                  Resumo de Performance
                </h3>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {report.summary.split("\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm text-foreground/90 leading-relaxed mb-3"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          {report.highlights.length > 0 && (
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cactus" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Principais Destaques
                  </h3>
                </div>
                <ul className="space-y-3">
                  {report.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <span className="w-6 h-6 rounded-full bg-cactus-soft dark:bg-cactus/10 flex items-center justify-center text-xs font-bold text-cactus shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Technologies & Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.technologies.length > 0 && (
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-cactus" />
                    <h3 className="text-base font-semibold text-foreground">
                      Tecnologias
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="rounded-full bg-cactus-soft dark:bg-cactus/10 text-cactus border-0"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {report.impact_areas.length > 0 && (
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-cactus" />
                    <h3 className="text-base font-semibold text-foreground">
                      Áreas de Impacto
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.impact_areas.map((area) => (
                      <Badge
                        key={area}
                        variant="outline"
                        className="rounded-full"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              🌵 Gerado pela IA do Cactus Labs •{" "}
              {new Date().toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!report && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cactus-soft dark:bg-cactus/10 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-cactus" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Pronto para analisar
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Selecione um período e clique em &quot;Gerar Relatório&quot; para obter uma
            análise da sua performance no GitHub feita por IA.
          </p>
        </div>
      )}
    </div>
  );
}
