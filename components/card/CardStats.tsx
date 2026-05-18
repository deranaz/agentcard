"use client";

import { cn, formatDuration, formatNumber } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";
import type { Theme } from "@/lib/themes";

type Props = {
  stats: SessionStats;
  theme: Theme;
};

type Stat = { label: string; value: string };

export function CardStats({ stats, theme }: Props) {
  const totalTokens =
    (stats.tokensIn || 0) + (stats.tokensOut || 0) || undefined;

  const items: Stat[] = [
    { label: "MESSAGES", value: formatNumber(stats.messages) },
    { label: "TOOL CALLS", value: formatNumber(stats.toolCalls) },
    { label: "FILES TOUCHED", value: formatNumber(stats.files.length) },
    { label: "DURATION", value: formatDuration(stats.durationSec) },
    { label: "TOKENS", value: formatNumber(totalTokens) },
    { label: "OUTCOME", value: (stats.outcome || "unknown").toUpperCase() },
  ];

  const wrap =
    theme === "mono"
      ? "border-zinc-200 bg-zinc-100"
      : theme === "terminal"
        ? "border-emerald-500/20 bg-emerald-500/5"
        : "border-white/10 bg-white/5";

  const cell =
    theme === "mono"
      ? "bg-zinc-50"
      : theme === "terminal"
        ? "bg-black"
        : "bg-zinc-950/60 backdrop-blur-sm";

  const labelCls =
    theme === "mono" ? "text-zinc-500" : "opacity-60";

  return (
    <div className={cn("grid grid-cols-3 gap-px overflow-hidden rounded-2xl border", wrap)}>
      {items.map((it) => (
        <div key={it.label} className={cn("p-4", cell)}>
          <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em]", labelCls)}>
            {it.label}
          </div>
          <div className="mt-2 text-lg font-semibold tabular-nums">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
