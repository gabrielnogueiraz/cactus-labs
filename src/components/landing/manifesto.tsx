export function Manifesto() {
  return (
    <section className="bg-landing-manifesto py-24 border-y border-landing-border/50">
      <div className="max-w-[680px] mx-auto px-6 text-center">
        <h2 className="font-serif text-[42px] font-bold text-landing-text mb-12 tracking-[-0.01em]">
          Por que o Cactus Labs existe
        </h2>
        
        <div className="flex flex-col gap-6 text-left sm:text-center text-[#2D2D2D] font-serif text-[18px] leading-[1.8]">
          <p>
            No final do ano, chega a hora de apresentar resultados.<br className="hidden sm:block" />
            E o desenvolvedor precisa vasculhar commits, pull requests e repositórios<br className="hidden sm:block" />
            espalhados para montar um relatório que deveria ser automático.
          </p>
          <p>
            O Cactus Labs nasceu dessa frustração. Uma ferramenta simples, honesta,<br className="hidden sm:block" />
            que centraliza sua atividade no GitHub, analisa seu impacto com IA<br className="hidden sm:block" />
            e gera relatórios prontos para apresentar.
          </p>
          <p>
            Feito por um desenvolvedor, para desenvolvedores.
          </p>
        </div>
        
        <p className="font-sans text-[14px] italic text-landing-text-muted mt-10 text-center">
          — Gabriel Nogueira, criador do Cactus Labs
        </p>
      </div>
    </section>
  );
}
