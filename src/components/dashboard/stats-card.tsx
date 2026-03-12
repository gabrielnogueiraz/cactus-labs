import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  description,
}: StatsCardProps) {
  return (
    <Card className="border border-border bg-card rounded-xl hover:border-cactus/20 transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <div className="w-8 h-8 rounded-lg bg-cactus-soft dark:bg-cactus/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-cactus" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className={cn("text-xs text-muted-foreground")}>{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
