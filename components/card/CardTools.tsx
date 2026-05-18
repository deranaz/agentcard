"use client";

import { cn } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";
import type { Theme, ThemeSpec } from "@/lib/themes";

type Props = {
  stats: SessionStats;
  spec: ThemeSpec;
  theme: Theme;
};

export function CardTools({ stats, spec, theme }: Props) {
  const wrap =
    theme === "mono"
      ? "border-zinc-200 bg-zinc-50"
      : theme === "terminal"
        ? "border-emerald-500/20 bg-emerald-500/5"
        : "border-white/10 bg-white/5";

  const muted =
    theme === "mono" ? "text-zinc-500" : "opacity-60";

  if (!stats.tools.length) {
    return (
      <div className={cn("rounded-2xl border p-4", wrap)}>
        <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em]", muted)}>
          TOOLS
        </div>
        <div className={cn("mt-2 text-sm", muted)}>
          No tool calls detected.
        </div>
      </div>
    );
  }

  const top = stats.tools.slice(0, 6);
  const max = Math.max(...top.map((t) => t.count), 1);

  const trackCls =
    theme === "mono"
      ? "bg-zinc-200"
      : theme === "terminal"
        ? "bg-emerald-500/10"
        : "bg-white/5";

  return (
    <div className={cn("rounded-2xl border p-4", wrap)}>
      <div className="flex items-baseline justify-between">
        <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em]", muted)}>
          TOP TOOLS
        </div>
        <div className={cn("text-[10px] font-mono", muted)}>
          {stats.tools.length} unique
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {top.map((t) => {
          const pct = Math.round((t.count / max) * 100);
          return (
            <li key={t.name} className="flex items-center gap-3 text-sm">
              <span className="font-mono truncate w-32 shrink-0">{t.name}</span>
              <div className={cn("relative flex-1 h-1.5 rounded-full overflow-hidden", trackCls)}>
                <div
                  className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", spec.accentBar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={cn("tabular-nums w-8 text-right", muted)}>
                {t.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
