export function Manifesto() {
  return (
    <section className="py-32 px-6 bg-[#F9FAFB]">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-12">
          Por que o Cactus Labs existe
        </h2>
        
        <div className="space-y-8 font-serif text-lg sm:text-xl text-foreground/90 leading-relaxed">
          <p>
            O Cactus Labs nasceu de uma frustração real. No final do ano, chega a hora de apresentar resultados para a diretoria — e o desenvolvedor precisa vasculhar históricos de commits, pull requests e repositórios espalhados para montar um relatório que deveria ser automático.
          </p>
          <p>
            Criado por Gabriel Nogueira, desenvolvedor fullstack especializado em automação de processos contábeis, o Cactus Labs é a ferramenta que ele queria ter encontrado: um dashboard que centraliza sua atividade no GitHub, analisa seu impacto com IA e gera relatórios prontos para apresentar.
          </p>
          <p className="font-bold">
            Simples. Honesto. Feito para quem constrói.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="italic text-muted-foreground">— Gabriel Nogueira, criador</p>
        </div>
      </div>
    </section>
  );
}
