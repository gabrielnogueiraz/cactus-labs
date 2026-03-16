import { ShieldCheck, Lock, Eye } from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Somente leitura",
    description:
      "Nunca escrevemos nada no seu GitHub. Acesso mínimo, apenas o necessário.",
  },
  {
    icon: Lock,
    title: "Dados protegidos",
    description:
      "Seu código nunca é armazenado. Apenas metadados de commits e PRs.",
  },
  {
    icon: Eye,
    title: "Transparente",
    description:
      "Projeto open source. Qualquer pessoa pode auditar o código.",
  },
] as const;

export function SecuritySection() {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="font-serif text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-tight mb-4"
            style={{ color: "#111111" }}
          >
            Sua segurança é prioridade
          </h2>
          <p
            className="font-sans text-[16px] max-w-lg mx-auto"
            style={{ color: "#888888" }}
          >
            Construído com os menores privilégios possíveis. Seu código e seus
            dados estão seguros.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: "#ECFDF5" }}
              >
                <card.icon
                  className="w-6 h-6"
                  style={{ color: "#16A34A" }}
                  strokeWidth={2}
                />
              </div>

              <h3
                className="font-serif text-[18px] font-bold mb-2 tracking-[-0.01em]"
                style={{ color: "#111111" }}
              >
                {card.title}
              </h3>

              <p
                className="font-sans text-[14px] leading-relaxed max-w-[260px]"
                style={{ color: "#888888" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
