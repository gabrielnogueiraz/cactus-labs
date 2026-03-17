import { FeatureShowcase } from "./feature-showcase";

export function Showcase() {
  return (
    <section
      className="py-32"
      style={{ backgroundColor: "#F5F4EF", borderTop: "1px solid rgba(232,230,223,0.6)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2
            className="font-serif text-[42px] font-bold tracking-[-0.01em] leading-tight mb-4"
            style={{ color: "#1A1A1A" }}
          >
            Do commit ao relatório,<br />
            em segundos.
          </h2>
          <p className="text-[17px] leading-relaxed" style={{ color: "#6B6B6B" }}>
            Chega de vasculhar histórico de repositórios na virada do ano.<br className="hidden sm:block" />
            Tudo que você construiu, organizado e pronto para apresentar.
          </p>
        </div>

        <FeatureShowcase />
      </div>
    </section>
  );
}
