"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { BragQuestion } from "@/types/github";

interface BragQuestionItemProps {
  question: BragQuestion;
  index: number;
  value: string;
  onChange: (value: string) => void;
}

export function BragQuestionItem({
  question,
  index,
  value,
  onChange,
}: BragQuestionItemProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
        group rounded-2xl border transition-all duration-500 ease-out
        ${
          value
            ? "border-cactus/30 bg-cactus/3 dark:bg-cactus/5"
            : isFocused
              ? "border-cactus/20 bg-muted/60"
              : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
        }
      `}
      style={{
        animationDelay: `${index * 120}ms`,
        animation: "bragSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <div className="p-5 space-y-4">
        {/* Question header */}
        <div className="flex items-start gap-3">
          <div
            className={`
            shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-300
            ${
              value
                ? "bg-cactus text-cactus-foreground"
                : "bg-muted text-muted-foreground"
            }
          `}
          >
            {index + 1}
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {question.texto}
            </p>
            <p className="text-xs text-muted-foreground/70 italic">
              {question.contexto}
            </p>
          </div>
        </div>

        {/* Answer input by type */}
        <div className="pl-10">
          {question.tipo === "sim_nao" && (
            <div className="flex flex-wrap gap-2">
              {["Sim", "Não"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange(option)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      value === option
                        ? "bg-cactus text-cactus-foreground shadow-sm shadow-cactus/20"
                        : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.tipo === "multipla_escolha" && question.opcoes && (
            <div className="flex flex-col gap-2">
              {question.opcoes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange(option)}
                  className={`
                    text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                    ${
                      value === option
                        ? "bg-cactus text-cactus-foreground shadow-sm shadow-cactus/20 font-medium"
                        : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`
                      w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors duration-200
                      ${
                        value === option
                          ? "border-cactus-foreground"
                          : "border-foreground/30"
                      }
                    `}
                    >
                      {value === option && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cactus-foreground" />
                      )}
                    </span>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.tipo === "texto_curto" && (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Sua resposta..."
              maxLength={200}
              className="rounded-xl border-border/60 bg-background/50 placeholder:text-muted-foreground/50 focus-visible:ring-cactus/30"
            />
          )}
        </div>
      </div>
    </div>
  );
}
