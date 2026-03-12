"use client";

import { Check } from "lucide-react";
import { LoginButton } from "@/components/landing/login-button";

export function Pricing() {
  return (
    <section className="py-32 bg-landing-bg">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-serif text-[48px] font-bold text-landing-text tracking-[-0.01em] mb-16">
          Quanto custa?
        </h2>

        <div className="max-w-[420px] mx-auto bg-landing-surface rounded-2xl border border-landing-border shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-10 relative">
          <div className="mb-8">
            <span className="font-serif text-[72px] font-bold text-landing-text leading-none block mb-3">
              R$ 0,00
            </span>
            <p className="font-sans text-[15px] text-landing-text-muted font-medium">
              Para sempre. Sem pegadinhas.
            </p>
          </div>

          <div className="h-px bg-landing-border/60 w-full mb-8" />

          <ul className="flex flex-col gap-4 text-left mb-10">
            {[
              "Acesso completo a todas as funcionalidades",
              "Relatórios ilimitados com IA",
              "Exportação em PDF e Excel",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 text-landing-accent">
                  <Check className="w-[18px] h-[18px] stroke-[3]" />
                </div>
                <span className="font-sans text-[15px] text-landing-text-muted leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <LoginButton
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Criar uma conta
          </LoginButton>
        </div>
      </div>
    </section>
  );
}
