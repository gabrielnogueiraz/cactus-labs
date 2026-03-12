"use client";

import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LogOut, Monitor, Moon, Sun, Palette } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas preferências
        </p>
      </div>

      {/* Appearance */}
      <Card className="border border-border bg-card rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-cactus" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Tema</p>
              <p className="text-xs text-muted-foreground">
                Selecione seu esquema de cores preferido
              </p>
            </div>
            <Select value={theme || "system"} onValueChange={(v) => v && setTheme(v)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Claro
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Escuro
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Sistema
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border border-border bg-card rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <LogOut className="w-4 h-4 text-cactus" />
            Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sair</p>
              <p className="text-xs text-muted-foreground">
                Sair da sua conta Cactus Labs
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive gap-2 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border border-border bg-card rounded-xl">
        <CardContent className="p-6 text-center">
          <p className="text-2xl mb-2">🌵</p>
          <p className="text-sm font-semibold text-foreground">Cactus Labs</p>
          <p className="text-xs text-muted-foreground mt-1">
            Painel de Performance do GitHub v1.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
