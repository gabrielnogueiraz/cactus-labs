"use client";

import { useState } from "react";

const items = [
  {
    id: "connect",
    titulo: "Conecte uma vez, use sempre",
    descricao:
      "Autorize o GitHub com um clique. O Cactus Labs importa automaticamente todos os seus repos, commits e PRs — públicos e privados.",
    imagem: "/screenshots/commits.png",
    alt: "Dashboard de commits do Cactus Labs",
  },
  {
    id: "metrics",
    titulo: "Métricas que contam histórias",
    descricao:
      "Não são só números. São evidências do seu impacto. Filtre por período, repositório ou tipo de atividade.",
    imagem: "/screenshots/dashboard.png",
    alt: "Dashboard de métricas do Cactus Labs",
  },
  {
    id: "report",
    titulo: "Relatório pronto para a diretoria",
    descricao:
      "A IA analisa seu trabalho e gera um resumo narrativo de impacto. Exporte em PDF, leve para a reunião.",
    imagem: "/screenshots/ia.png",
    alt: "Relatório gerado por IA no Cactus Labs",
  },
];

export function FeatureShowcase() {
  const [activeId, setActiveId] = useState(items[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8 lg:gap-16 items-center">
      {/* Esquerda - Bullets Interativos */}
      <div className="flex flex-col gap-2 max-w-[380px] mx-auto lg:mx-0 w-full">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`text-left w-full transition-all duration-200 cursor-pointer p-5 md:p-6 ${
                isActive
                  ? "bg-landing-surface rounded-xl shadow-sm"
                  : "bg-transparent hover:bg-white/60 rounded-xl"
              }`}
            >
              <h3
                className={`font-serif text-[18px] md:text-[20px] mb-2 md:mb-3 ${
                  isActive ? "text-[#111827] font-bold" : "text-landing-text"
                }`}
              >
                {item.titulo}
              </h3>
              <p
                className={`text-[14px] leading-normal ${
                  isActive ? "text-[#374151]" : "text-[#6B7280]"
                }`}
              >
                {item.descricao}
              </p>
            </button>
          );
        })}
      </div>

      {/* Direita - Flat Screenshot */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          aspectRatio: "16/10",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8E6DF",
          boxShadow: "0 12px 48px rgba(0,0,0,0.06)",
        }}
      >
        {items.map((item) => (
          <img
            key={item.id}
            src={item.imagem}
            alt={item.alt}
            className={`absolute inset-0 w-full h-full object-cover object-top-left transition-opacity duration-200 ease-in-out z-10 ${
              item.id === activeId ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ))}
        {/* Placeholder if image fails */}
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-6 z-0">
          <span className="text-[48px] mb-3 leading-none">🌵</span>
          <p className="text-[15px] font-sans font-medium" style={{ color: "#6B6B6B" }}>
            Showcase Preview
          </p>
        </div>
      </div>
    </div>
  );
}
