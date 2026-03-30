"use client";

import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  BarChart3,
  Code2,
  Target,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import type {
  AIReportData,
  TimePeriod,
  BragPreAnalysis,
  BragAnswer,
} from "@/types/github";
import { generateReportPDF } from "@/lib/export/pdf";
import { BragQuestionsPanel } from "@/components/dashboard/brag-questions-panel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportStep =
  | "idle"
  | "pre-analyzing"
  | "questions"
  | "generating"
  | "done";

const LOADING_MESSAGES = [
  "Conectando ao GitHub...",
  "Buscando repositórios...",
  "Analisando commits e PRs...",
  "Identificando padrões de impacto...",
  "Preparando perguntas contextuais...",
];

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
// Animated loading with progressive messages
// ---------------------------------------------------------------------------

function AnalysisLoader({ step }: { step: "pre-analyzing" | "generating" }) {
  const [msgIndex, setMsgIndex] = useState(0);

  const messages =
    step === "pre-analyzing"
      ? LOADING_MESSAGES
      : [
          "Processando suas respostas...",
          "Combinando dados do GitHub com contexto...",
          "Gerando análise de impacto...",
          "Escrevendo relatório detalhado...",
          "Finalizando...",
        ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="flex flex-col items-center justify-center py-20 space-y-6"
      style={{ animation: "bragFadeIn 0.4s ease-out both" }}
    >
      {/* Spinner */}
      <div className="relative">
        <div className="w-20 h-20 border-4 border-cactus/10 rounded-full" />
        <div className="w-20 h-20 border-4 border-cactus border-t-transparent rounded-full animate-spin absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-7 h-7 text-cactus/60" />
        </div>
      </div>

      {/* Animated Messages */}
      <div className="text-center space-y-2 h-12">
        <p
          key={msgIndex}
          className="text-sm font-medium text-foreground"
          style={{ animation: "bragFadeIn 0.5s ease-out both" }}
        >
          {messages[msgIndex]}
        </p>
        <p className="text-xs text-muted-foreground">
          {step === "pre-analyzing"
            ? "A IA está analisando seu código para gerar perguntas contextuais"
            : "A IA está gerando um relatório enriquecido com suas respostas"}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i <= msgIndex
                ? "bg-cactus scale-100"
                : "bg-muted-foreground/20 scale-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AIReportPage() {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const [step, setStep] = useState<ReportStep>("idle");
  const [preAnalysis, setPreAnalysis] = useState<BragPreAnalysis | null>(null);
  const [report, setReport] = useState<AIReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [padroesOpen, setPadroesOpen] = useState(false);
  const [hadAnswers, setHadAnswers] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // -----------------------------------------------------------------------
  // Step 1: Pre-analysis — fetch GitHub data + generate contextual questions
  // -----------------------------------------------------------------------
  const startPreAnalysis = async () => {
    setStep("pre-analyzing");
    setError(null);
    setReport(null);
    setPreAnalysis(null);
    setHadAnswers(false);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai-report/pre-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha na pré-análise");
      }

      const data = await response.json();
      const analysis = data.preAnalysis as BragPreAnalysis;

      // If AI returned no questions, go straight to report generation
      if (!analysis.perguntas || analysis.perguntas.length === 0) {
        setStep("generating");
        await generateFinalReport([]);
        return;
      }

      setPreAnalysis(analysis);
      setStep("questions");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
      setStep("idle");
    }
  };

  // -----------------------------------------------------------------------
  // Step 2→3: Generate final report with optional user answers
  // -----------------------------------------------------------------------
  const generateFinalReport = async (userAnswers: BragAnswer[]) => {
    setStep("generating");
    setError(null);
    setHadAnswers(userAnswers.length > 0);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, userAnswers }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao gerar relatório");
      }

      const data = await response.json();
      setReport(data.report);
      setStep("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
      setStep("idle");
    }
  };

  const handleSkipQuestions = () => {
    generateFinalReport([]);
  };

  const handleRestart = () => {
    abortRef.current?.abort();
    setStep("idle");
    setReport(null);
    setPreAnalysis(null);
    setError(null);
    setHadAnswers(false);
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
      "Developer",
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

  const isLoading = step === "pre-analyzing" || step === "generating";

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
        {step === "done" && (
          <Button
            variant="outline"
            onClick={handleRestart}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Novo relatório
          </Button>
        )}
      </div>

      {/* Controls — visible only in idle state */}
      {step === "idle" && (
        <Card className="border border-border bg-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Selecione o período de análise
                </p>
                <p className="text-xs text-muted-foreground">
                  A IA analisará seus commits e PRs, gerará perguntas
                  contextuais e criará um relatório detalhado
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
                  onClick={startPreAnalysis}
                  className="bg-cactus hover:bg-cactus/90 text-cactus-foreground gap-2 rounded-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border border-destructive/20 bg-destructive/5 rounded-xl">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading animation */}
      {isLoading && <AnalysisLoader step={step as "pre-analyzing" | "generating"} />}

      {/* Questions step */}
      {step === "questions" && preAnalysis && (
        <BragQuestionsPanel
          preAnalysis={preAnalysis}
          onSubmit={generateFinalReport}
          onSkip={handleSkipQuestions}
          isSubmitting={false}
        />
      )}

      {/* Report Output */}
      {report && step === "done" && (
        <div
          className="space-y-6"
          style={{ animation: "bragFadeIn 0.6s ease-out both" }}
        >
          {/* Enriched badge + export button */}
          <div className="flex items-center justify-between">
            {hadAnswers && (
              <Badge className="rounded-full bg-cactus/10 text-cactus border-cactus/20 gap-1.5 py-1 px-3">
                <Sparkles className="w-3 h-3" />
                Relatório enriquecido com suas respostas
              </Badge>
            )}
            <div className={hadAnswers ? "" : "ml-auto"}>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="gap-2 rounded-xl"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </Button>
            </div>
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
                      return (
                        (order[a.prioridade] ?? 2) -
                        (order[b.prioridade] ?? 2)
                      );
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
              {hadAnswers && " • Enriquecido com Brag Document"}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {step === "idle" && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cactus-soft dark:bg-cactus/10 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-cactus" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Pronto para analisar
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Selecione um período e clique em &quot;Gerar Relatório&quot;. A IA
            analisará seus dados e fará perguntas contextuais para criar um
            relatório de impacto personalizado.
          </p>
        </div>
      )}
    </div>
  );
}
