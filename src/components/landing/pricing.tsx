"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Pricing() {
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
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Quanto custa?
          </h2>
        </div>

        <div className="max-w-md mx-auto border border-border bg-card rounded-2xl p-8 sm:p-10 shadow-sm text-center">
          <div className="mb-6">
            <span className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">R$ 0,00</span>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Para sempre. Sem pegadinhas.
          </p>

          <ul className="space-y-4 text-left mb-10">
            <li className="flex items-center gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-cactus/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-cactus" />
              </div>
              <span className="text-foreground">Acesso completo a todas as funcionalidades</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-cactus/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-cactus" />
              </div>
              <span className="text-foreground">Relatórios ilimitados com IA</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-cactus/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-cactus" />
              </div>
              <span className="text-foreground">Exportação em PDF e Excel</span>
            </li>
          </ul>

          <Button 
            onClick={handleLogin}
            className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-xl py-6 text-base"
          >
            Começar agora
          </Button>
        </div>
      </div>
    </section>
  );
}
