"use client";

import { cn } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";

type Props = {
  stats: SessionStats;
};

const OUTCOME_LABEL: Record<NonNullable<SessionStats["outcome"]>, string> = {
  success: "SHIPPED",
  partial: "PARTIAL",
  failed: "FAILED",
  unknown: "RAN",
};

const OUTCOME_CLASS: Record<NonNullable<SessionStats["outcome"]>, string> = {
  success: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  partial: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  failed: "text-rose-400 border-rose-400/40 bg-rose-400/10",
  unknown: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
};

export function CardHeader({ stats }: Props) {
  const outcome = stats.outcome ?? "unknown";
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          <span>{stats.agent}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-mono">{stats.model}</span>
        </div>
        <h2 className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-zinc-50 line-clamp-2">
          {stats.title}
        </h2>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full border px-3 py-1 text-[10px] font-mono tracking-[0.18em]",
          OUTCOME_CLASS[outcome],
        )}
      >
        {OUTCOME_LABEL[outcome]}
      </span>
    </div>
  );
}
