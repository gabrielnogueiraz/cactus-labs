"use client";

import { Check } from "lucide-react";
import { LoginButton } from "@/components/landing/login-button";

export function Pricing() {
  return (
    <section id="planos" className="py-32" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-12">
          {/* Left — Headline */}
          <div className="lg:max-w-[480px] text-center lg:text-left lg:pt-6">
            <h2
              className="font-serif text-[48px] sm:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ color: "#111111" }}
            >
              Preço simples.
              <br />
              Grande valor.
            </h2>
            <p
              className="font-sans text-[18px] leading-relaxed"
              style={{ color: "#666666" }}
            >
              Comece agora de forma totalmente gratuita.
              <br className="hidden sm:block" />
              Sem testes. Sem surpresas.
            </p>
          </div>

          {/* Right — Pricing card */}
          <div
            className="w-full max-w-[480px] rounded-2xl p-10 relative"
            style={{
              backgroundColor: "#F9F8F4",
              border: "1px solid rgba(232,230,223,0.5)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            }}
          >
            {/* Price + Badge */}
            <div className="flex items-end gap-3 mb-4">
              <div className="flex items-baseline">
                <span
                  className="font-serif text-[56px] sm:text-[72px] font-bold leading-none tracking-[-0.02em]"
                  style={{ color: "#111111" }}
                >
                  R$ 0
                </span>
                <span
                  className="text-[24px] sm:text-[32px] font-serif font-bold tracking-[-0.02em]"
                  style={{ color: "#111111" }}
                >
                  /mês
                </span>
              </div>
              <div className="pb-2">
                <span
                  className="px-2.5 py-0.5 rounded text-[12px] font-bold text-white tracking-wide"
                  style={{ backgroundColor: "#22C55E" }}
                >
                  Ótimo negócio
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p
              className="font-serif text-[20px] font-bold mb-2 tracking-[-0.01em]"
              style={{ color: "#22C55E" }}
            >
              Acesso ilimitado a tudo
            </p>
            <p
              className="font-sans text-[14px] mb-8"
              style={{ color: "#6B6B6B" }}
            >
              Uma forma simples de centralizar sua performance no GitHub
              para desenvolvedores que querem ser mais produtivos.
            </p>

            {/* Divider */}
            <div
              className="h-px w-full mb-8"
              style={{ backgroundColor: "rgba(232,230,223,0.6)" }}
            />

            {/* Features */}
            <ul className="flex flex-col gap-4 text-left mb-10">
              {[
                "Acesso completo a todas as funcionalidades",
                "Relatórios ilimitados com IA",
                "Exportação em PDF e Excel",
                "Dashboard completo de atividade",
                "Análise de commits, PRs e repositórios",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0" style={{ color: "#16A34A" }}>
                    <Check className="w-[18px] h-[18px]" strokeWidth={3} />
                  </div>
                  <span
                    className="font-sans text-[15px] leading-relaxed"
                    style={{ color: "#6B6B6B" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <LoginButton className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer">
              Começar agora — é grátis
            </LoginButton>
          </div>
        </div>
      </div>
    </section>
  );
}
