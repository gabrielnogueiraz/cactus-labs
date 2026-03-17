export function SocialProof() {
  return (
    <section
      className="py-8"
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E8E6DF",
        borderBottom: "1px solid #E8E6DF",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-[17px]" style={{ color: "#16A34A" }}>+80</span>
          <span className="font-sans text-[15px]" style={{ color: "#6B7280" }}>devs já conectaram seu GitHub</span>
        </div>
        <span className="hidden md:inline text-landing-border mx-1">&bull;</span>
        <p className="text-[17px] italic font-serif tracking-wide opacity-90" style={{ color: "#6B6B6B" }}>
          &quot;A ferramenta que eu queria ter encontrado há anos.&quot;
        </p>
      </div>
    </section>
  );
}
