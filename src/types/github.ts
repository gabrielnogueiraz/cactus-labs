export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubOrganization {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  updated_at: string;
  pushed_at: string | null;
  created_at: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  message: string;
  date: string;
  author: string;
  repo: string;
  html_url: string;
  additions?: number;
  deletions?: number;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  merged: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  repo: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  changed_files?: number;
  additions?: number;
  deletions?: number;
  comments?: number;
}

export interface GitHubReview {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string | null;
  state: string;
  submitted_at: string;
  html_url: string;
  pull_request_url: string;
}

export interface DashboardStats {
  totalCommits: number;
  prsMerged: number;
  prsOpen: number;
  activeRepos: number;
  reviewsDone: number;
}

export interface ActivityDataPoint {
  date: string;
  commits: number;
  pullRequests: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ScoreItem {
  nota: number;
  justificativa: string;
}

export interface AIReportData {
  resumo_executivo: {
    o_que_foi_construido: string;
    padroes_de_comportamento: string;
    avaliacao_de_maturidade: string;
  };

  destaques: Array<{
    titulo: string;
    descricao: string;
    impacto_inferido: string;
    evidencia: string;
  }>;

  pontos_criticos: Array<{
    observacao: string;
    evidencia: string;
    recomendacao: string;
  }>;

  padroes_identificados: {
    ritmo_de_trabalho: string;
    foco_tecnico: string;
    lacunas: string;
    evolucao_no_periodo: string;
  };

  tecnologias: string[];
  areas_de_impacto: string[];

  recomendacoes: Array<{
    prioridade: "Alta" | "Média" | "Baixa";
    acao: string;
    justificativa: string;
  }>;

  scores: {
    produtividade: ScoreItem;
    consistencia: ScoreItem;
    amplitude_tecnica: ScoreItem;
    qualidade_inferida: ScoreItem;
  };

  // Preserved for metrics display (computed on the server, not by Groq)
  _meta?: {
    total_commits: number;
    total_prs: number;
    repos_contributed: number;
    media_semanal: number;
  };
}

export type TimePeriod = "7d" | "30d" | "90d" | "1y";
