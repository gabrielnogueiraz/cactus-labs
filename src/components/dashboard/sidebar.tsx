"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GitCommitHorizontal,
  GitPullRequest,
  FolderGit2,
  BrainCircuit,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/commits", label: "Commits", icon: GitCommitHorizontal },
  {
    href: "/dashboard/pull-requests",
    label: "Pull Requests",
    icon: GitPullRequest,
  },
  { href: "/dashboard/repositories", label: "Repositórios", icon: FolderGit2 },
  { href: "/dashboard/ai-report", label: "Relatório IA", icon: BrainCircuit },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full border-r border-border bg-card flex flex-col transition-all duration-300 lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn("h-16 flex items-center border-b border-border relative transition-all", isCollapsed ? "justify-center" : "justify-between px-6")}>
          <Link href="/dashboard" className={cn("flex items-center overflow-hidden", isCollapsed ? "justify-center" : "gap-2")}>
            <span className={cn("shrink-0 transition-transform duration-300", isCollapsed ? "text-2xl" : "text-xl")}>🌵</span>
            {!isCollapsed && <span className="font-semibold text-foreground whitespace-nowrap">Cactus Labs</span>}
          </Link>
          <div className={cn("flex items-center gap-1", isCollapsed && "absolute -right-3 top-1/2 -translate-y-1/2")}>
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden shrink-0", isCollapsed && "hidden")}
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant={isCollapsed ? "outline" : "ghost"}
              size="icon"
              className={cn(
                "hidden lg:flex shrink-0 z-50 transition-all", 
                isCollapsed ? "w-6 h-6 rounded-full bg-background shadow-md border-border text-muted-foreground hover:text-foreground" : "w-8 h-8 text-muted-foreground hover:bg-transparent"
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cactus/10 text-cactus dark:bg-cactus/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4", isActive && "text-cactus")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center truncate">
            {isCollapsed ? "v1.0" : "🌵 Cactus Labs v1.0"}
          </p>
        </div>
      </aside>
    </>
  );
}
