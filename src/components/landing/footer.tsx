import { Linkedin, Instagram, Globe, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16">
          
          {/* Esquerda */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="text-[24px]">🌵</span>
              <span className="font-serif text-[20px] font-bold text-white tracking-tight">Cactus Labs</span>
            </div>
            <p className="font-sans text-[14px] text-[#A3A3A3]">
              Feito com dedicação por Gabriel Nogueira
            </p>
          </div>
          
          {/* Direita - Socials */}
          <div className="flex items-center gap-5">
            <a 
              href="https://linkedin.com/in/gabriel-nogueira-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-landing-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/gabrielnogueira" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-landing-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-landing-accent transition-colors"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-landing-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Linha inferior */}
        <div className="pt-8 border-t border-[#2D2D2D] text-center md:text-left">
          <p className="font-sans text-[#858585] text-[13px]">
            © 2025 Cactus Labs — Código aberto e gratuito para todos.
          </p>
        </div>
      </div>
    </footer>
  );
}
