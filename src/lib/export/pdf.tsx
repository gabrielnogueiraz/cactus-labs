"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { AIReportData } from "@/types/github";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#111827",
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#16A34A",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#16A34A",
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    color: "#374151",
    marginTop: 4,
  },
  text: {
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 1.6,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 2,
    paddingLeft: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  metricBox: {
    width: "30%",
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 8,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#16A34A",
  },
  metricLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  tag: {
    backgroundColor: "#DCFCE7",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 9,
    color: "#16A34A",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  scoreRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    width: "35%",
    color: "#374151",
  },
  scoreValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#16A34A",
    width: "10%",
  },
  scoreJustificativa: {
    fontSize: 10,
    color: "#6B7280",
    width: "55%",
  },
  priorityAlta: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
  },
  priorityMedia: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#D97706",
  },
  priorityBaixa: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#16A34A",
  },
  cardBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    padding: 8,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  alertBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#D97706",
    padding: 8,
    marginBottom: 5,
  },
});

interface ReportPDFProps {
  report: AIReportData;
  period: string;
  username: string;
}

function PriorityText({ p }: { p: string }) {
  const s =
    p === "Alta"
      ? styles.priorityAlta
      : p === "Média"
        ? styles.priorityMedia
        : styles.priorityBaixa;
  return <Text style={s}>[{p}]</Text>;
}

function ReportPDF({ report, period, username }: ReportPDFProps) {
  const meta = report._meta;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cactus Labs — Relatório de Performance</Text>
          <Text style={styles.subtitle}>
            {username} • {period} • Gerado em{" "}
            {new Date().toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Metrics */}
        {meta && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Métricas Principais</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{meta.total_commits}</Text>
                <Text style={styles.metricLabel}>Total de Commits</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{meta.total_prs}</Text>
                <Text style={styles.metricLabel}>Pull Requests</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{meta.repos_contributed}</Text>
                <Text style={styles.metricLabel}>Repositórios</Text>
              </View>
            </View>
          </View>
        )}

        {/* Resumo Executivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Executivo</Text>
          {report.resumo_executivo.o_que_foi_construido ? (
            <Text style={styles.text}>
              {report.resumo_executivo.o_que_foi_construido}
            </Text>
          ) : null}
          {report.resumo_executivo.padroes_de_comportamento ? (
            <Text style={styles.text}>
              {report.resumo_executivo.padroes_de_comportamento}
            </Text>
          ) : null}
          {report.resumo_executivo.avaliacao_de_maturidade ? (
            <Text style={styles.text}>
              {report.resumo_executivo.avaliacao_de_maturidade}
            </Text>
          ) : null}
        </View>

        {/* Destaques */}
        {report.destaques.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destaques</Text>
            {report.destaques.map((d, i) => (
              <View key={i} style={styles.cardBox}>
                <Text style={styles.cardTitle}>{d.titulo}</Text>
                <Text style={styles.text}>{d.descricao}</Text>
                <Text style={{ fontSize: 10, color: "#6B7280" }}>
                  Evidência: {d.evidencia}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Pontos Críticos */}
        {report.pontos_criticos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pontos Críticos</Text>
            {report.pontos_criticos.map((pc, i) => (
              <View key={i} style={styles.alertBox}>
                <Text style={styles.text}>{pc.observacao}</Text>
                <Text style={{ fontSize: 10, color: "#6B7280" }}>
                  {pc.evidencia}
                </Text>
                <Text style={{ fontSize: 10, color: "#374151", marginTop: 4 }}>
                  Recomendação: {pc.recomendacao}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.page}>
        {/* Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scores</Text>
          {(
            [
              ["Produtividade", report.scores.produtividade],
              ["Consistência", report.scores.consistencia],
              ["Amplitude Técnica", report.scores.amplitude_tecnica],
              ["Qualidade Inferida", report.scores.qualidade_inferida],
            ] as const
          ).map(([label, score]) => (
            <View key={label} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{label}</Text>
              <Text style={styles.scoreValue}>{score.nota}/10</Text>
              <Text style={styles.scoreJustificativa}>
                {score.justificativa}
              </Text>
            </View>
          ))}
        </View>

        {/* Padrões Identificados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Padrões Identificados</Text>
          {report.padroes_identificados.ritmo_de_trabalho ? (
            <View>
              <Text style={styles.subsectionTitle}>Ritmo de Trabalho</Text>
              <Text style={styles.text}>
                {report.padroes_identificados.ritmo_de_trabalho}
              </Text>
            </View>
          ) : null}
          {report.padroes_identificados.foco_tecnico ? (
            <View>
              <Text style={styles.subsectionTitle}>Foco Técnico</Text>
              <Text style={styles.text}>
                {report.padroes_identificados.foco_tecnico}
              </Text>
            </View>
          ) : null}
          {report.padroes_identificados.lacunas ? (
            <View>
              <Text style={styles.subsectionTitle}>Lacunas</Text>
              <Text style={styles.text}>
                {report.padroes_identificados.lacunas}
              </Text>
            </View>
          ) : null}
          {report.padroes_identificados.evolucao_no_periodo ? (
            <View>
              <Text style={styles.subsectionTitle}>Evolução no Período</Text>
              <Text style={styles.text}>
                {report.padroes_identificados.evolucao_no_periodo}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Recomendações */}
        {report.recomendacoes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recomendações</Text>
            {[...report.recomendacoes]
              .sort((a, b) => {
                const order = { Alta: 0, Média: 1, Baixa: 2 } as const;
                return (
                  (order[a.prioridade] ?? 2) - (order[b.prioridade] ?? 2)
                );
              })
              .map((r, i) => (
                <View key={i} style={styles.cardBox}>
                  <PriorityText p={r.prioridade} />
                  <Text style={styles.text}>{r.acao}</Text>
                  <Text style={{ fontSize: 10, color: "#6B7280" }}>
                    {r.justificativa}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* Tecnologias */}
        {report.tecnologias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tecnologias</Text>
            <View style={styles.tagContainer}>
              {report.tecnologias.map((tech: string, i: number) => (
                <Text key={i} style={styles.tag}>
                  {tech}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Áreas de Impacto */}
        {report.areas_de_impacto.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Áreas de Impacto</Text>
            {report.areas_de_impacto.map((area: string, i: number) => (
              <Text key={i} style={styles.listItem}>
                • {area}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Gerado por Cactus Labs — Painel de Performance do GitHub
        </Text>
      </Page>
    </Document>
  );
}

export async function generateReportPDF(
  report: AIReportData,
  period: string,
  username: string
): Promise<Blob> {
  const doc = <ReportPDF report={report} period={period} username={username} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
