import {
  BarChart3,
  BrainCircuit,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Métricas Ricas",
    description:
      "Frequência de commits, velocidade de PRs, heatmaps de contribuição e mais. Veja seus padrões de código ganharem vida com gráficos bonitos.",
  },
  {
    icon: BrainCircuit,
    title: "Análise com Inteligência Artificial",
    description:
      "Receba relatórios de performance personalizados gerados por IA. Entenda seus pontos fortes, áreas de foco e trajetória de crescimento.",
  },
  {
    icon: FileDown,
    title: "Exporte para Qualquer Lugar",
    description:
      "Baixe seus relatórios em PDFs refinados ou exporte dados brutos para o Excel. Perfeito para avaliações de desempenho e portfólios.",
  },
];

export function Features() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tudo o que você precisa para <span className="text-cactus">entender</span> seu código
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um kit de ferramentas completo para desenvolvedores que desejam medir, analisar e apresentar seu trabalho de engenharia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-border bg-card hover:border-cactus/30 transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-cactus-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-6 h-6 text-cactus" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
