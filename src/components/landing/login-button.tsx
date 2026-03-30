"use client";

import { createClient } from "@/lib/supabase/client";

interface LoginButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LoginButton({ children, className }: LoginButtonProps) {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "repo read:user user:email read:org",
      },
    });
  };

  return (
    <button onClick={handleLogin} className={`cursor-pointer ${className || ""}`}>
      {children}
    </button>
  );
}
