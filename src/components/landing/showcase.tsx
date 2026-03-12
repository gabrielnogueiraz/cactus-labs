"use client";

export function Showcase() {
  return (
    <section className="py-32 bg-landing-bg border-t border-landing-border/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="font-serif text-[42px] font-bold text-landing-text tracking-[-0.01em] leading-tight mb-4">
            Do commit ao relatório,<br />
            em segundos.
          </h2>
          <p className="text-landing-text-muted text-[17px] leading-relaxed">
            Chega de vasculhar histórico de repositórios na virada do ano.<br className="hidden sm:block" />
            Tudo que você construiu, organizado e pronto para apresentar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-center">
          {/* Esquerda - Bullets */}
          <div className="flex flex-col gap-12 max-w-md mx-auto lg:mx-0">
            <div>
              <h3 className="font-serif font-bold text-[22px] text-landing-text mb-3">
                Conecte uma vez, use sempre
              </h3>
              <p className="text-[15px] text-landing-text-muted leading-[1.6]">
                Autorize o GitHub com um clique. O Cactus Labs importa automaticamente 
                todos os seus repos, commits e PRs — públicos e privados.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-[22px] text-landing-text mb-3">
                Métricas que contam histórias
              </h3>
              <p className="text-[15px] text-landing-text-muted leading-[1.6]">
                Não são só números. São evidências do seu impacto. Filtre por período, 
                repositório ou tipo de atividade.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-[22px] text-landing-text mb-3">
                Relatório pronto para a diretoria
              </h3>
              <p className="text-[15px] text-landing-text-muted leading-[1.6]">
                A IA analisa seu trabalho e gera um resumo narrativo de impacto. 
                Exporte em PDF, leve para a reunião.
              </p>
            </div>
          </div>

          {/* Direita - Flat Screenshot */}
          <div className="relative w-full aspect-[16/10] bg-landing-surface rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.06)] border border-landing-border overflow-hidden">
            <img 
              src="/screenshots/commits.png" 
              alt="Feature Preview" 
              className="w-full h-full object-cover object-left-top relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Placeholder */}
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-6 z-0">
              <span className="text-[48px] mb-3 leading-none">🌵</span>
              <p className="text-[15px] font-sans text-landing-text-muted font-medium">Showcase Preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
