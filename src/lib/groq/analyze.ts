import Groq from "groq-sdk";
import type {
  GitHubCommit,
  GitHubPullRequest,
  AIReportData,
  BragQuestion,
  BragAnswer,
  BragPreAnalysis,
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
// Brag Document — pre-analysis question generation
// ---------------------------------------------------------------------------

export async function generateBragQuestions(
  commits: GitHubCommit[],
  pullRequests: GitHubPullRequest[],
  period: string,
  username: string,
): Promise<BragPreAnalysis> {
  const commitsPorRepo = agruparCommitsPorRepositorio(commits);

  const totalRepos = new Set([
    ...commits.map((c) => c.repo),
    ...pullRequests.map((pr) => pr.repo),
  ]).size;

  const prData = pullRequests.slice(0, 15).map((pr) => ({
    titulo: pr.title,
    repo: pr.repo,
    status: pr.state,
    merged: pr.merged_at ? true : false,
  }));

  const systemPrompt = `Você é um assistente que ajuda desenvolvedores a documentar seu impacto profissional.
Analise a atividade do GitHub abaixo e gere de 3 a 5 perguntas ESPECÍFICAS e CONTEXTUAIS para entender o impacto real do trabalho.

Regras:
- Máximo 5 perguntas — respeite o tempo do usuário
- Cada pergunta deve referenciar algo REAL dos dados (commit, PR, repo, número específico)
- Mix de tipos: algumas sim_nao, algumas texto_curto, algumas multipla_escolha
- Foque no que a IA NÃO consegue inferir sozinha:
  • Impacto de negócio (reduziu custo? acelerou processo?)
  • Contexto organizacional (entrega de projeto? sprint? hackathon?)
  • Resultado para o usuário final (resolve dor real? quantos impactados?)
  • Colaboração (liderou? trabalho solo? mentoria?)
- Não pergunte o que já está nos dados (ex: "quantos commits?", "quais repos?")
- Perguntas devem ser conversacionais e diretas, não burocráticas
- Para multipla_escolha, forneça 3-4 opções relevantes

Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown:
{
  "perguntas": [
    {
      "id": "q1",
      "texto": "pergunta específica aqui",
      "tipo": "sim_nao" | "texto_curto" | "multipla_escolha",
      "opcoes": ["opção 1", "opção 2"],
      "contexto": "qual dado do GitHub motivou essa pergunta"
    }
  ]
}`;

  const userPrompt = `Desenvolvedor: ${username} | Período: ${period} | Total commits: ${commits.length} | Total PRs: ${pullRequests.length} | Repos ativos: ${totalRepos}

## COMMITS POR REPOSITÓRIO (top 5)
${JSON.stringify(commitsPorRepo)}

## PULL REQUESTS (amostra)
${JSON.stringify(prData)}

Gere perguntas contextuais baseadas nesses dados REAIS.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  let perguntas: BragQuestion[] = [];

  try {
    const parsed = JSON.parse(content) as { perguntas: BragQuestion[] };
    perguntas = parsed.perguntas ?? [];
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as { perguntas: BragQuestion[] };
        perguntas = parsed.perguntas ?? [];
      } catch {
        perguntas = [];
      }
    }
  }

  return {
    perguntas,
    github_summary: {
      total_commits: commits.length,
      total_prs: pullRequests.length,
      repos_contributed: totalRepos,
      top_repos: commitsPorRepo.map((r) => r.repo),
    },
  };
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

export async function analyzePerformance(
  commits: GitHubCommit[],
  pullRequests: GitHubPullRequest[],
  period: string,
  username: string,
  userAnswers?: BragAnswer[],
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
  const systemPrompt = `Você é um Engineering Manager sênior com 15 anos de experiência avaliando performance técnica de desenvolvedores. Sua função é analisar dados de atividade do GitHub e produzir um relatório executivo justo e construtivo.

Seja direto, específico e baseado nos dados fornecidos.
Nunca invente informações. Se não há evidência, não afirme.

IMPORTANTE sobre o resumo_executivo: cada um dos 3 campos deve conter 2 a 3 frases claras e diretas. Seja didático e contextualizado — cite exemplos concretos dos dados e explique brevemente o porquê das conclusões. Não seja genérico nem superficial, mas também não se estenda demais.

## REGRAS DE SCORING (0-10) — siga rigorosamente:

### Produtividade (volume de entrega no período):
- 1-20 commits → 3-4
- 21-50 commits → 5-6
- 51-100 commits → 6-7
- 101-200 commits → 7-8
- 201-400 commits → 8-9
- 400+ commits → 9-10
Ajuste para cima se houver PRs mergeados. Ajuste para baixo apenas se os commits forem triviais (só typos, configs).

### Consistência (regularidade ao longo do período):
- Avalie com base na distribuição semanal. Se o dev teve commits na maioria das semanas, é consistente.
- Variação semanal é NORMAL e não deve penalizar. Penalize apenas se houver semanas inteiras sem atividade.
- Não penalize ausência de PRs — muitos devs trabalham com trunk-based development ou push direto.
- Mediana de commits/semana > 5 → mínimo 6

### Amplitude Técnica (diversidade de atuação):
- 1 repo → 3-4
- 2-3 repos → 5-6
- 4-5 repos → 7-8
- 6+ repos → 8-9
Ajustar para cima se as mensagens de commit indicam trabalho em áreas diversas (frontend, backend, devops, IA, etc).

### Qualidade Inferida (sinais de qualidade no que é visível):
- Mensagens de commit descritivas e claras = bom sinal (+2)
- PRs com descrição e revisão = bom sinal (+1)
- Baixo percentual de mensagens vagas (< 10%) = bom sinal (+1)
- Não penalize ausência de testes ou arquitetura — esses dados NÃO estão disponíveis.
- Não penalize ausência de PRs — pode ser workflow da equipe.
- Base: comece em 5 e ajuste para cima/baixo com os sinais acima.

## IMPORTANTE:
- Os scores devem refletir o que está NOS DADOS, não o que está faltando.
- Na dúvida entre duas notas, escolha a MAIOR.
- 544 commits em um período é excepcional. 100+ commits é muito bom. Scores abaixo de 5 são para atividade realmente baixa.

Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown.`;

  const prData = pullRequests.slice(0, 15).map((pr) => ({
    titulo: pr.title,
    status: pr.state,
    merged: pr.merged_at ? true : false,
  }));

  // Build user answers context block
  let answersBlock = "";
  if (userAnswers && userAnswers.length > 0) {
    answersBlock = `\n\n## CONTEXTO DO DESENVOLVEDOR (respostas fornecidas pelo próprio dev)
${userAnswers.map((a) => `- ${a.questionId}: ${a.value}`).join("\n")}

IMPORTANTE: Use as respostas do desenvolvedor para enriquecer a análise. Faça afirmações contextualizadas sobre impacto de negócio, resultados para o usuário final e contexto organizacional com base nessas respostas. Isso é o diferencial deste relatório.`;
  }

  const userPrompt = `Desenvolvedor: ${username} | Período: ${period} | Commits: ${commits.length} | PRs: ${pullRequests.length} | Repos: ${totalRepos}

## COMMITS POR REPO (top 5)
${JSON.stringify(commitsPorRepo)}

## PRs (amostra)
${JSON.stringify(prData)}

## MÉTRICAS
Média semanal: ${mediaSemanal} | Pico: ${semanaPico.label}(${semanaPico.total}) | Vale: ${semanaVale.label}(${semanaVale.total}) | Ratio feat/fix: ${ratioFixFeature} | Msgs vagas: ${percentualVago}%${answersBlock}

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
