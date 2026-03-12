"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "read:user repo read:org",
      },
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cactus-soft/40 via-background to-background dark:from-cactus/5 dark:via-background dark:to-background" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-[15%] w-72 h-72 bg-cactus/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-cactus/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Huge Cactus / Badge replacing generic badge */}
        <div className="mb-10 animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="text-7xl sm:text-8xl drop-shadow-md">🌵</span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
          Seu trabalho<br className="hidden sm:block" /> merecer ser <span className="text-cactus">visto</span>.
        </h1>

        {/* Subline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Conecte seu GitHub e transforme commits e pull requests em um relatório de impacto real. Criado por devs, para devs.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-cactus hover:bg-cactus/90 text-cactus-foreground px-8 py-6 text-base rounded-xl gap-2 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cactus/20"
          >
            <Github className="w-5 h-5" />
            Conectar com GitHub
          </Button>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
            Gratuito. Sem cartão de crédito.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-foreground mb-1">100%</div>
            <div>Privado</div>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-foreground mb-1">IA</div>
            <div>Insights profundos</div>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-foreground mb-1">PDF</div>
            <div>Pronto para exportar</div>
          </div>
        </div>
      </div>
    </section>
  );
}
