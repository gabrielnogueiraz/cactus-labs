"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  GitCommitHorizontal,
  GitPullRequest,
  FolderGit2,
  ArrowRight,
  SkipForward,
  MessageSquareText,
} from "lucide-react";
import type { BragPreAnalysis, BragAnswer } from "@/types/github";
import { BragQuestionItem } from "@/components/dashboard/brag-question-item";

interface BragQuestionsPanelProps {
  preAnalysis: BragPreAnalysis;
  onSubmit: (answers: BragAnswer[]) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export function BragQuestionsPanel({
  preAnalysis,
  onSubmit,
  onSkip,
  isSubmitting,
}: BragQuestionsPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answeredCount = Object.values(answers).filter(
    (v) => v.trim().length > 0,
  ).length;
  const totalQuestions = preAnalysis.perguntas.length;
  const progressPct =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  function handleChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    const bragAnswers: BragAnswer[] = Object.entries(answers)
      .filter(([, v]) => v.trim().length > 0)
      .map(([questionId, value]) => ({ questionId, value }));
    onSubmit(bragAnswers);
  }

  return (
    <div
      className="space-y-6"
      style={{ animation: "bragFadeIn 0.5s ease-out both" }}
    >
      {/* Header card */}
      <Card className="border border-border bg-card rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Top gradient accent */}
          <div className="h-1 bg-linear-to-r from-cactus/60 via-cactus to-cactus/60" />

          <div className="p-6 space-y-5">
            {/* Title  */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cactus/10 flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5 text-cactus" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Antes de gerar seu relatório...
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Analisei sua atividade e tenho algumas perguntas rápidas para
                  enriquecer a análise.
                </p>
              </div>
            </div>

            {/* GitHub summary pills */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="rounded-full bg-muted/80 text-foreground/80 border-0 gap-1.5 py-1 px-3"
              >
                <GitCommitHorizontal className="w-3.5 h-3.5" />
                {preAnalysis.github_summary.total_commits} commits
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-muted/80 text-foreground/80 border-0 gap-1.5 py-1 px-3"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                {preAnalysis.github_summary.total_prs} PRs
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-muted/80 text-foreground/80 border-0 gap-1.5 py-1 px-3"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                {preAnalysis.github_summary.repos_contributed} repos
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {answeredCount} de {totalQuestions} respondidas
                </span>
                {answeredCount > 0 && (
                  <span className="text-xs text-cactus font-medium">
                    {Math.round(progressPct)}%
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-cactus to-cactus/80 transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions list */}
      <div className="space-y-3">
        {preAnalysis.perguntas.map((question, index) => (
          <BragQuestionItem
            key={question.id}
            question={question}
            index={index}
            value={answers[question.id] ?? ""}
            onChange={(value) => handleChange(question.id, value)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div
        className="flex flex-col sm:flex-row items-center gap-3 pt-2"
        style={{ animation: "bragSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both" }}
      >
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-cactus hover:bg-cactus/90 text-cactus-foreground gap-2 rounded-xl px-6 py-2.5 text-sm font-medium shadow-sm shadow-cactus/20 transition-all duration-200 hover:shadow-md hover:shadow-cactus/20"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-cactus-foreground/30 border-t-cactus-foreground rounded-full animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar relatório
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <button
          onClick={onSkip}
          disabled={isSubmitting}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Pular perguntas
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground/60 text-center pb-2">
        Responder as perguntas gera um relatório visivelmente mais detalhado e
        contextualizado.
      </p>
    </div>
  );
}
