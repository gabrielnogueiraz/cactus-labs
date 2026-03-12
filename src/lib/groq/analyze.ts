import Groq from "groq-sdk";
import type {
  GitHubCommit,
  GitHubPullRequest,
  AIReportData,
} from "@/types/github";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------------------------------------------------------------------
// Pre-processing helpers
// ---------------------------------------------------------------------------

interface RepoGroup {
  repo: string;
  total: number;
  mensagens: string[];
}

interface WeekBucket {
  label: string;
  total: number;
}

function agruparCommitsPorRepositorio(commits: GitHubCommit[]): RepoGroup[] {
  const map = new Map<string, GitHubCommit[]>();
  for (const c of commits) {
    const arr = map.get(c.repo) ?? [];
    arr.push(c);
    map.set(c.repo, arr);
  }

  return Array.from(map.entries())
    .map(([repo, list]) => ({
      repo,
      total: list.length,
      mensagens: list.slice(0, 5).map((c) => c.message),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

function agruparPorSemana(commits: GitHubCommit[]): WeekBucket[] {
  const map = new Map<string, number>();
  for (const c of commits) {
    const d = new Date(c.date);
    // ISO week label: "YYYY-Wxx"
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(
      ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
    );
    const label = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    map.set(label, (map.get(label) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function calcularMedia(semanas: WeekBucket[]): number {
  if (semanas.length === 0) return 0;
  const soma = semanas.reduce((acc, s) => acc + s.total, 0);
  return Math.round((soma / semanas.length) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

export async function analyzePerformance(
  commits: GitHubCommit[],
  pullRequests: GitHubPullRequest[],
  period: string,
  username: string,
): Promise<AIReportData> {
  // --- Pre-processing ---
  const commitsPorRepo = agruparCommitsPorRepositorio(commits);

  const commitsPorSemana = agruparPorSemana(commits);
  const mediaSemanal = calcularMedia(commitsPorSemana);

  const defaultWeek: WeekBucket = { label: "N/A", total: 0 };
  const semanaPico =
    commitsPorSemana.length > 0
      ? commitsPorSemana.reduce((max, s) => (s.total > max.total ? s : max))
      : defaultWeek;
  const semanaVale =
    commitsPorSemana.length > 0
      ? commitsPorSemana.reduce((min, s) => (s.total < min.total ? s : min))
      : defaultWeek;

  const totalFix = commits.filter((c) =>
    c.message.toLowerCase().match(/^(fix|bug|hotfix|patch|corrig)/),
  ).length;
  const totalFeature = commits.filter((c) =>
    c.message.toLowerCase().match(/^(feat|add|implement|cria|nova|novo)/),
  ).length;
  const ratioFixFeature =
    totalFix > 0
      ? (totalFeature / totalFix).toFixed(2)
      : "N/A (sem commits de fix identificados)";

  const mensagensVagas = commits.filter((c) =>
    c.message
      .toLowerCase()
      .match(/^(fix|update|wip|ajuste|correção|minor|misc|temp)$/i),
  ).length;
  const percentualVago =
    commits.length > 0
      ? ((mensagensVagas / commits.length) * 100).toFixed(1)
      : "0.0";

  const totalRepos = new Set([
    ...commits.map((c) => c.repo),
    ...pullRequests.map((pr) => pr.repo),
  ]).size;

  // --- Prompt building ---
  const systemPrompt = `Você é um Engineering Manager sênior com 15 anos de experiência avaliando performance técnica de desenvolvedores. Sua função é analisar dados de atividade do GitHub e produzir um relatório executivo honesto — não um elogio, uma análise.

Seja direto, específico e baseado apenas nos dados fornecidos.
Nunca invente informações. Se não há evidência, não afirme.

IMPORTANTE sobre o resumo_executivo: cada um dos 3 campos deve conter 2 a 3 frases claras e diretas. Seja didático e contextualizado — cite exemplos concretos dos dados e explique brevemente o porquê das conclusões. Não seja genérico nem superficial, mas também não se estenda demais.

Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown.`;

  const prData = pullRequests.slice(0, 15).map((pr) => ({
    titulo: pr.title,
    status: pr.state,
    merged: pr.merged_at ? true : false,
  }));

  const userPrompt = `Desenvolvedor: ${username} | Período: ${period} | Commits: ${commits.length} | PRs: ${pullRequests.length} | Repos: ${totalRepos}

## COMMITS POR REPO (top 5)
${JSON.stringify(commitsPorRepo)}

## PRs (amostra)
${JSON.stringify(prData)}

## MÉTRICAS
Média semanal: ${mediaSemanal} | Pico: ${semanaPico.label}(${semanaPico.total}) | Vale: ${semanaVale.label}(${semanaVale.total}) | Ratio feat/fix: ${ratioFixFeature} | Msgs vagas: ${percentualVago}%

Responda com JSON nesta estrutura exata:
{"resumo_executivo":{"o_que_foi_construido":"str","padroes_de_comportamento":"str","avaliacao_de_maturidade":"str"},"destaques":[{"titulo":"str","descricao":"str","impacto_inferido":"str","evidencia":"str"}],"pontos_criticos":[{"observacao":"str","evidencia":"str","recomendacao":"str"}],"padroes_identificados":{"ritmo_de_trabalho":"str","foco_tecnico":"str","lacunas":"str","evolucao_no_periodo":"str"},"tecnologias":["str"],"areas_de_impacto":["str"],"recomendacoes":[{"prioridade":"Alta|Média|Baixa","acao":"str","justificativa":"str"}],"scores":{"produtividade":{"nota":0,"justificativa":"str"},"consistencia":{"nota":0,"justificativa":"str"},"amplitude_tecnica":{"nota":0,"justificativa":"str"},"qualidade_inferida":{"nota":0,"justificativa":"str"}}}`;

  // --- Call Groq ---
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  // --- Parse response ---
  let parsed: AIReportData;

  try {
    parsed = JSON.parse(content) as AIReportData;
  } catch {
    // Try to extract JSON from potential markdown wrapping
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]) as AIReportData;
      } catch {
        return buildFallbackReport(
          "A IA retornou uma resposta em formato inválido. Tente gerar o relatório novamente.",
          commits.length,
          pullRequests.length,
          totalRepos,
          mediaSemanal,
        );
      }
    } else {
      return buildFallbackReport(
        "Não foi possível interpretar a resposta da IA. Tente novamente.",
        commits.length,
        pullRequests.length,
        totalRepos,
        mediaSemanal,
      );
    }
  }

  // Attach server-side metadata
  parsed._meta = {
    total_commits: commits.length,
    total_prs: pullRequests.length,
    repos_contributed: totalRepos,
    media_semanal: mediaSemanal,
  };

  return parsed;
}

// ---------------------------------------------------------------------------
// Fallback
// ---------------------------------------------------------------------------

function buildFallbackReport(
  errorMessage: string,
  totalCommits: number,
  totalPRs: number,
  reposContributed: number,
  mediaSemanal: number,
): AIReportData {
  return {
    resumo_executivo: {
      o_que_foi_construido: errorMessage,
      padroes_de_comportamento: "",
      avaliacao_de_maturidade: "",
    },
    destaques: [],
    pontos_criticos: [],
    padroes_identificados: {
      ritmo_de_trabalho: "",
      foco_tecnico: "",
      lacunas: "",
      evolucao_no_periodo: "",
    },
    tecnologias: [],
    areas_de_impacto: [],
    recomendacoes: [],
    scores: {
      produtividade: { nota: 0, justificativa: "" },
      consistencia: { nota: 0, justificativa: "" },
      amplitude_tecnica: { nota: 0, justificativa: "" },
      qualidade_inferida: { nota: 0, justificativa: "" },
    },
    _meta: {
      total_commits: totalCommits,
      total_prs: totalPRs,
      repos_contributed: reposContributed,
      media_semanal: mediaSemanal,
    },
  };
}
