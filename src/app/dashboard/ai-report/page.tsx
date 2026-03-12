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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import type { AIReportData, TimePeriod } from "@/types/github";
import { generateReportPDF } from "@/lib/export/pdf";

// ---------------------------------------------------------------------------
// Score progress bar component
// ---------------------------------------------------------------------------

function ScoreBar({
  label,
  nota,
  justificativa,
}: {
  label: string;
  nota: number;
  justificativa: string;
}) {
  const pct = Math.min(nota, 10) * 10;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-cactus">{nota}/10</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-cactus transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{justificativa}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Priority badge
// ---------------------------------------------------------------------------

function PriorityBadge({ p }: { p: string }) {
  const colorMap: Record<string, string> = {
    Alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Média:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Baixa:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return (
    <Badge className={`rounded-full border-0 text-xs ${colorMap[p] ?? ""}`}>
      {p}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AIReportPage() {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const [report, setReport] = useState<AIReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [padroesOpen, setPadroesOpen] = useState(false);

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
          {report._meta && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-cactus">
                    {report._meta.total_commits}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Commits</p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-cactus">
                    {report._meta.total_prs}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pull Requests
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-cactus">
                    {report._meta.repos_contributed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Repositórios
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-cactus">
                    {report._meta.media_semanal}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Commits/semana
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resumo Executivo — 3 paragraphs */}
          <Card className="border border-border bg-card rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cactus" />
                <h3 className="text-lg font-semibold text-foreground">
                  Resumo Executivo
                </h3>
              </div>
              <div className="space-y-3">
                {report.resumo_executivo.o_que_foi_construido && (
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {report.resumo_executivo.o_que_foi_construido}
                  </p>
                )}
                {report.resumo_executivo.padroes_de_comportamento && (
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {report.resumo_executivo.padroes_de_comportamento}
                  </p>
                )}
                {report.resumo_executivo.avaliacao_de_maturidade && (
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {report.resumo_executivo.avaliacao_de_maturidade}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Destaques — cards with title, description, evidence badge */}
          {report.destaques.length > 0 && (
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cactus" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Destaques
                  </h3>
                </div>
                <div className="space-y-4">
                  {report.destaques.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-muted/40 p-4 space-y-2"
                    >
                      <h4 className="text-sm font-semibold text-foreground">
                        {d.titulo}
                      </h4>
                      <p className="text-sm text-foreground/80">{d.descricao}</p>
                      {d.impacto_inferido && (
                        <p className="text-xs text-muted-foreground">
                          Impacto: {d.impacto_inferido}
                        </p>
                      )}
                      {d.evidencia && (
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-cactus-soft dark:bg-cactus/10 text-cactus border-0 text-xs"
                        >
                          {d.evidencia}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pontos Críticos — alert-style cards */}
          {report.pontos_criticos.length > 0 && (
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Pontos Críticos
                  </h3>
                </div>
                <div className="space-y-4">
                  {report.pontos_criticos.map((pc, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 p-4 space-y-2"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {pc.observacao}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pc.evidencia}
                      </p>
                      <p className="text-xs text-foreground/80">
                        <span className="font-semibold">Recomendação:</span>{" "}
                        {pc.recomendacao}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scores — 4 progress bars */}
          <Card className="border border-border bg-card rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-cactus" />
                <h3 className="text-lg font-semibold text-foreground">
                  Scores
                </h3>
              </div>
              <div className="space-y-5">
                <ScoreBar
                  label="Produtividade"
                  nota={report.scores.produtividade.nota}
                  justificativa={report.scores.produtividade.justificativa}
                />
                <ScoreBar
                  label="Consistência"
                  nota={report.scores.consistencia.nota}
                  justificativa={report.scores.consistencia.justificativa}
                />
                <ScoreBar
                  label="Amplitude Técnica"
                  nota={report.scores.amplitude_tecnica.nota}
                  justificativa={report.scores.amplitude_tecnica.justificativa}
                />
                <ScoreBar
                  label="Qualidade Inferida"
                  nota={report.scores.qualidade_inferida.nota}
                  justificativa={report.scores.qualidade_inferida.justificativa}
                />
              </div>
            </CardContent>
          </Card>

          {/* Padrões Identificados — collapsible */}
          <Card className="border border-border bg-card rounded-xl">
            <CardContent className="p-6">
              <button
                onClick={() => setPadroesOpen(!padroesOpen)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-cactus" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Padrões Identificados
                  </h3>
                </div>
                {padroesOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {padroesOpen && (
                <div className="mt-4 space-y-4">
                  {report.padroes_identificados.ritmo_de_trabalho && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Ritmo de Trabalho
                      </h4>
                      <p className="text-sm text-foreground/80">
                        {report.padroes_identificados.ritmo_de_trabalho}
                      </p>
                    </div>
                  )}
                  {report.padroes_identificados.foco_tecnico && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Foco Técnico
                      </h4>
                      <p className="text-sm text-foreground/80">
                        {report.padroes_identificados.foco_tecnico}
                      </p>
                    </div>
                  )}
                  {report.padroes_identificados.lacunas && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Lacunas
                      </h4>
                      <p className="text-sm text-foreground/80">
                        {report.padroes_identificados.lacunas}
                      </p>
                    </div>
                  )}
                  {report.padroes_identificados.evolucao_no_periodo && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Evolução no Período
                      </h4>
                      <p className="text-sm text-foreground/80">
                        {report.padroes_identificados.evolucao_no_periodo}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendações — sorted by priority */}
          {report.recomendacoes.length > 0 && (
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-cactus" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Recomendações
                  </h3>
                </div>
                <div className="space-y-3">
                  {[...report.recomendacoes]
                    .sort((a, b) => {
                      const order: Record<string, number> = {
                        Alta: 0,
                        Média: 1,
                        Baixa: 2,
                      };
                      return (order[a.prioridade] ?? 2) - (order[b.prioridade] ?? 2);
                    })
                    .map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                      >
                        <PriorityBadge p={r.prioridade} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-foreground">{r.acao}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.justificativa}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies & Impact Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.tecnologias.length > 0 && (
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-cactus" />
                    <h3 className="text-base font-semibold text-foreground">
                      Tecnologias
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.tecnologias.map((tech) => (
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

            {report.areas_de_impacto.length > 0 && (
              <Card className="border border-border bg-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-cactus" />
                    <h3 className="text-base font-semibold text-foreground">
                      Áreas de Impacto
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.areas_de_impacto.map((area) => (
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
              Gerado pela IA do Cactus Labs •{" "}
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
