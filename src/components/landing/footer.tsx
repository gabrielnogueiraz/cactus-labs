import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center sm:flex-row sm:justify-between gap-8">
        {/* Left side */}
        <div className="flex flex-col items-center sm:items-start gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌵</span>
            <span className="font-serif font-bold text-foreground text-lg">Cactus Labs</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Feito com dedicação por Gabriel Nogueira
          </p>
        </div>

        {/* Right side - Socials */}
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/gabrielnogueira"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
             href="https://instagram.com/gabrielnogueira"
             target="_blank"
             rel="noopener noreferrer"
             className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Portfólio
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      {/* Bottom line */}
      <div className="max-w-5xl mx-auto px-6 mt-16 pt-8 border-t border-border/50 text-center sm:text-left">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cactus Labs — Código aberto e gratuito
        </p>
      </div>
    </footer>
  );
}
