"use client";

import { cn } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";
import type { ThemeSpec } from "@/lib/themes";

type Props = {
  stats: SessionStats;
  spec: ThemeSpec;
};

const OUTCOME_LABEL: Record<NonNullable<SessionStats["outcome"]>, string> = {
  success: "SHIPPED",
  partial: "PARTIAL",
  failed: "FAILED",
  unknown: "RAN",
};

export function CardHeader({ stats, spec }: Props) {
  const outcome = stats.outcome ?? "unknown";
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-70">
          <span>{stats.agent}</span>
          <span className="opacity-50">·</span>
          <span className="font-mono">{stats.model}</span>
        </div>
        <h2 className="mt-3 text-xl sm:text-2xl font-semibold leading-tight line-clamp-2">
          {stats.title}
        </h2>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full border px-3 py-1 text-[10px] font-mono tracking-[0.18em]",
          spec.badgeMap[outcome],
        )}
      >
        {OUTCOME_LABEL[outcome]}
      </span>
    </div>
  );
}
