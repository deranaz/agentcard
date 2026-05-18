"use client";

import { formatDuration, formatNumber } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";

type Props = {
  stats: SessionStats;
};

type Stat = { label: string; value: string };

export function CardStats({ stats }: Props) {
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

  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {items.map((it) => (
        <div
          key={it.label}
          className="bg-zinc-950/60 p-4 backdrop-blur-sm"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            {it.label}
          </div>
          <div className="mt-2 text-lg font-semibold tabular-nums text-zinc-100">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
