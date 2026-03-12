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
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#16A34A",
    paddingBottom: 15,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#16A34A",
  },
  text: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.6,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 4,
    paddingLeft: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  metricBox: {
    width: "30%",
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 10,
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
});

interface ReportPDFProps {
  report: AIReportData;
  period: string;
  username: string;
}

function ReportPDF({ report, period, username }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>🌵 Cactus Labs — Relatório de Performance</Text>
          <Text style={styles.subtitle}>
            {username} • {period} • Gerado em{" "}
            {new Date().toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.text}>{report.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Principais</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {report.metrics.total_commits}
              </Text>
              <Text style={styles.metricLabel}>Total de Commits</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {report.metrics.total_prs}
              </Text>
              <Text style={styles.metricLabel}>Pull Requests</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {report.metrics.repos_contributed}
              </Text>
              <Text style={styles.metricLabel}>Repositórios</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          {report.highlights.map((highlight, i) => (
            <Text key={i} style={styles.listItem}>
              • {highlight}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias</Text>
          <View style={styles.tagContainer}>
            {report.technologies.map((tech, i) => (
              <Text key={i} style={styles.tag}>
                {tech}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas de Impacto</Text>
          {report.impact_areas.map((area, i) => (
            <Text key={i} style={styles.listItem}>
              • {area}
            </Text>
          ))}
        </View>

        <Text style={styles.footer}>
          Gerado por Cactus Labs 🌵 — Painel de Performance do GitHub
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
