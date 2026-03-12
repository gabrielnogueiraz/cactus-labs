import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Manifesto } from "@/components/landing/manifesto";
import { Pricing } from "@/components/landing/pricing";
import { Showcase } from "@/components/landing/showcase";
import { SocialProof } from "@/components/landing/social-proof";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/landing/login-button";
import { Github } from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main style={{ backgroundColor: "#F5F4EF", minHeight: "100vh", color: "#1A1A1A" }} className="font-sans">
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px] leading-none">🌵</span>
            <span className="font-serif text-[22px] font-bold tracking-tight" style={{ color: "#1A1A1A" }}>Cactus Labs</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#manifesto" className="transition-colors text-[15px] font-medium hidden sm:block" style={{ color: "#6B6B6B" }}>Manifesto</a>
            <a href="#funcionalidades" className="transition-colors text-[15px] font-medium hidden sm:block" style={{ color: "#6B6B6B" }}>Funcionalidades</a>
            <LoginButton className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-[15px] font-medium hover:bg-black transition-colors shadow-sm cursor-pointer">
              Entrar com GitHub
            </LoginButton>
          </div>
        </div>
      </nav>
      
      <Hero />
      <SocialProof />
      <div id="funcionalidades">
        <Features />
        <Showcase />
      </div>
      <div id="manifesto">
        <Manifesto />
      </div>
      <Pricing />
      <Footer />
    </main>
  );
}
