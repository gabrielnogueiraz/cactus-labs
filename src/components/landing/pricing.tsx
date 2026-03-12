"use client";

import { Check } from "lucide-react";
import { LoginButton } from "@/components/landing/login-button";

export function Pricing() {
  return (
    <section className="py-32" style={{ backgroundColor: "#F5F4EF" }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className="font-serif text-[48px] font-bold tracking-[-0.01em] mb-16"
          style={{ color: "#1A1A1A" }}
        >
          Quanto custa?
        </h2>

        <div
          className="max-w-[420px] mx-auto rounded-2xl p-10 relative"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E6DF",
            boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
          }}
        >
          <div className="mb-8">
            <span
              className="font-serif text-[72px] font-bold leading-none block mb-3"
              style={{ color: "#1A1A1A" }}
            >
              R$ 0,00
            </span>
            <p className="font-sans text-[15px] font-medium" style={{ color: "#6B6B6B" }}>
              Para sempre. Sem pegadinhas.
            </p>
          </div>

          <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(232,230,223,0.6)" }} />

          <ul className="flex flex-col gap-4 text-left mb-10">
            {[
              "Acesso completo a todas as funcionalidades",
              "Relatórios ilimitados com IA",
              "Exportação em PDF e Excel",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 shrink-0" style={{ color: "#16A34A" }}>
                  <Check className="w-[18px] h-[18px]" strokeWidth={3} />
                </div>
                <span className="font-sans text-[15px] leading-relaxed" style={{ color: "#6B6B6B" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <LoginButton className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer">
            Criar uma conta
          </LoginButton>
        </div>
      </div>
    </section>
  );
}
