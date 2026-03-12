"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { LoginButton } from "@/components/landing/login-button";

export function Hero() {
  return (
    <section
      className="relative pt-[180px] pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]"
      style={{ backgroundColor: "#F5F4EF" }}
    >
      {/* Pattern de pontos discreto no lado direito */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block"
        style={{
          backgroundImage: "radial-gradient(circle, #C8C5BC 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[48%_50%] gap-12 lg:gap-8 items-center relative z-10 w-full">
        {/* Esquerda */}
        <div className="flex flex-col gap-8 max-w-[540px]">
          <h1
            className="font-serif text-[56px] lg:text-[62px] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ color: "#1A1A1A" }}
          >
            Seu trabalho
            <br />
            merece ser visto.
          </h1>
          <p className="text-[18px] leading-[1.6]" style={{ color: "#6B6B6B" }}>
            Conecte seu GitHub e transforme commits e pull requests em
            relatórios de impacto prontos para apresentar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <LoginButton className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-8 py-4 rounded-xl text-[16px] font-medium hover:bg-black transition-colors cursor-pointer">
              <Github className="w-5 h-5" />
              Conectar com GitHub
            </LoginButton>
            <Link
              href="#funcionalidades"
              className="flex items-center justify-center px-8 py-4 rounded-xl text-[16px] font-medium transition-all shadow-sm hover:bg-white"
              style={{ border: "1px solid #E8E6DF", color: "#1A1A1A", backgroundColor: "transparent" }}
            >
              Ver demonstração
            </Link>
          </div>
        </div>

        {/* Direita */}
        <div className="relative w-[110%] lg:w-[125%] mt-12 lg:mt-0 max-w-[800px] mx-auto lg:ml-0 lg:-mr-16">
          <div
            className="w-full rounded-xl overflow-hidden flex items-center justify-center relative"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E6DF",
              boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
              transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(1.05)",
            }}
          >
            <img
              src="/screenshots/dashboard.png"
              alt="Dashboard Preview"
              className="w-full h-auto z-10 relative"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-6 z-0">
              <span className="text-[48px] mb-3 leading-none">🌵</span>
              <p className="text-[15px] font-sans font-medium" style={{ color: "#6B6B6B" }}>
                Dashboard Preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
