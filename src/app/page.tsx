import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Manifesto } from "@/components/landing/manifesto";
import { Pricing } from "@/components/landing/pricing";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌵</span>
            <span className="font-serif text-xl font-bold text-foreground pt-1">Cactus Labs</span>
          </div>
        </div>
      </nav>
      <div className="pt-20">
        <Hero />
        <Manifesto />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}
