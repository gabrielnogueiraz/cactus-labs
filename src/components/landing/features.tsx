"use client";

import {
  GitCommitHorizontal,
  GitPullRequest,
  BarChart2,
  Sparkles,
  Building2,
  FileDown,
  Calendar,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: GitCommitHorizontal,
    title: "Commits Detalhados",
    description: "Visualize todos os commits por repositório, data e mensagem. Filtre e busque no histórico completo.",
    color: "bg-[#DCFCE7] text-[#16A34A]",
  },
  {
    icon: GitPullRequest,
    title: "Pull Requests",
    description: "Acompanhe PRs abertos, merged e fechados com status em tempo real.",
    color: "bg-[#DBEAFE] text-[#2563EB]",
  },
  {
    icon: BarChart2,
    title: "Métricas Visuais",
    description: "Gráficos de atividade, heatmap de contribuições e evolução ao longo do tempo.",
    color: "bg-[#FEF9C3] text-[#CA8A04]",
  },
  {
    icon: Sparkles,
    title: "Análise com IA",
    description: "Inteligência artificial analisa seus commits e gera narrativas de impacto real.",
    color: "bg-[#F3E8FF] text-[#9333EA]",
  },
  {
    icon: Building2,
    title: "Organizações",
    description: "Suporte completo a orgs do GitHub — veja sua atividade em todos os contextos.",
    color: "bg-[#FCE7F3] text-[#DB2777]",
  },
  {
    icon: FileDown,
    title: "Exportação",
    description: "Exporte relatórios em PDF ou Excel para apresentar aos seus líderes.",
    color: "bg-[#FFEDD5] text-[#EA580C]",
  },
  {
    icon: Calendar,
    title: "Filtros por Período",
    description: "Semana, mês, trimestre ou ano. Você escolhe o recorte temporal.",
    color: "bg-[#DCFCE7] text-[#16A34A]",
  },
  {
    icon: Lock,
    title: "Seguro e Privado",
    description: "Seus dados ficam na sua conta. Nunca compartilhamos informações com terceiros.",
    color: "bg-[#F3F4F6] text-[#4B5563]",
  },
];

export function Features() {
  return (
    <section className="py-32" style={{ backgroundColor: "#F5F4EF" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2
            className="font-serif text-[42px] font-bold tracking-[-0.01em] leading-tight mb-4"
            style={{ color: "#1A1A1A" }}
          >
            Funcionalidades feitas para quem constrói.
          </h2>
          <p className="text-[17px] leading-relaxed" style={{ color: "#6B6B6B" }}>
            Todas as métricas que importam, organizadas do jeito certo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center mb-6 ${feature.color}`}>
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-[18px] font-bold mb-3" style={{ color: "#1A1A1A" }}>
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-relaxed font-sans" style={{ color: "#6B6B6B" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
