import Groq from "groq-sdk";
import type {
  GitHubCommit,
  GitHubPullRequest,
  AIReportData,
} from "@/types/github";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzePerformance(
  commits: GitHubCommit[],
  pullRequests: GitHubPullRequest[],
  period: string,
): Promise<AIReportData> {
  const commitSummary = commits.slice(0, 100).map((c) => ({
    repo: c.repo,
    message: c.message,
    date: c.date,
  }));

  const prSummary = pullRequests.slice(0, 50).map((pr) => ({
    repo: pr.repo,
    title: pr.title,
    state: pr.state,
    merged: pr.merged,
    created_at: pr.created_at,
  }));

  const prompt = `Você é um Engenheiro de Software Senior (Engineering Manager) analisando os dados de performance de um desenvolvedor no GitHub para o período de ${period}.

Aqui estão os dados de atividade:

## Commits (${commits.length} total, mostrando até 100):
${JSON.stringify(commitSummary, null, 2)}

## Pull Requests (${pullRequests.length} total, mostrando até 50):
${JSON.stringify(prSummary, null, 2)}

Analise esses dados e responda APENAS com um objeto JSON válido (sem markdown, sem blocos de código) com esta estrutura exata. O conteúdo da análise DEVE SER EM PORTUGUÊS (pt-BR):
{
  "summary": "2 a 3 parágrafos de análise narrativa detalhada da performance do desenvolvedor, pontos fortes e áreas de foco em português",
  "highlights": ["array de 3 a 5 conquistas principais ou contribuições notáveis em português"],
  "technologies": ["array de tecnologias/linguagens detectadas a partir dos nomes dos repositórios e mensagens de commit em português"],
  "impact_areas": ["array de áreas/domínios para os quais o desenvolvedor contribuiu em português"],
  "metrics": {
    "total_commits": ${commits.length},
    "total_prs": ${pullRequests.length},
    "total_reviews": 0,
    "repos_contributed": ${new Set([...commits.map((c) => c.repo), ...pullRequests.map((pr) => pr.repo)]).size},
    "lines_added": 0,
    "lines_removed": 0
  }
}

Seja específico, profissional e embasado em dados na sua análise. Mencione nomes de repositórios e padrões de commits. RESPONDA EM PORTUGUÊS (PT-BR).`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  try {
    // Try to parse the response directly
    const parsed = JSON.parse(content) as AIReportData;
    return parsed;
  } catch {
    // If direct parse fails, try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as AIReportData;
    }

    // Fallback response
    return {
      summary: "Não foi possível gerar a análise. Tente novamente.",
      highlights: [],
      technologies: [],
      impact_areas: [],
      metrics: {
        total_commits: commits.length,
        total_prs: pullRequests.length,
        total_reviews: 0,
        repos_contributed: 0,
        lines_added: 0,
        lines_removed: 0,
      },
    };
  }
}
