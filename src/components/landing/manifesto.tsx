export function Manifesto() {
  return (
    <section
      className="py-24"
      style={{
        backgroundColor: "#EDECEA",
        borderTop: "1px solid rgba(232,230,223,0.5)",
        borderBottom: "1px solid rgba(232,230,223,0.5)",
      }}
    >
      <div className="max-w-[680px] mx-auto px-6 text-center">
        <h2
          className="font-serif text-[42px] font-bold mb-12 tracking-[-0.01em]"
          style={{ color: "#1A1A1A" }}
        >
          Por que o Cactus Labs existe
        </h2>

        <div
          className="flex flex-col gap-6 text-left sm:text-center font-serif text-[18px] leading-[1.8]"
          style={{ color: "#2D2D2D" }}
        >
          <p>
            No final do ano, chega a hora de apresentar resultados.
            <br className="hidden sm:block" />E o desenvolvedor precisa
            vasculhar commits, pull requests e repositórios espalhados para
            montar um relatório que deveria ser automático.
          </p>
          <p>
            O Cactus Labs nasceu dessa frustração. Uma ferramenta simples,
            honesta, que centraliza sua atividade no GitHub, analisa seu impacto
            com IA e gera relatórios prontos para apresentar.
          </p>
          <p>Feito por um desenvolvedor, para desenvolvedores.</p>
        </div>

        <p
          className="font-sans text-[14px] italic mt-10 text-center"
          style={{ color: "#6B6B6B" }}
        >
          — Gabriel Nogueira, criador do Cactus Labs
        </p>
      </div>
    </section>
  );
}
