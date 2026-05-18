"use client";

import type { SessionStats } from "@/lib/types";

type Props = {
  stats: SessionStats;
};

export function CardTools({ stats }: Props) {
  if (!stats.tools.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          TOOLS
        </div>
        <div className="mt-2 text-sm text-zinc-500">
          No tool calls detected.
        </div>
      </div>
    );
  }

  const top = stats.tools.slice(0, 6);
  const max = Math.max(...top.map((t) => t.count), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          TOP TOOLS
        </div>
        <div className="text-[10px] font-mono text-zinc-600">
          {stats.tools.length} unique
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {top.map((t) => {
          const pct = Math.round((t.count / max) * 100);
          return (
            <li key={t.name} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-zinc-300 truncate w-32 shrink-0">
                {t.name}
              </span>
              <div className="relative flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="tabular-nums text-zinc-400 w-8 text-right">
                {t.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
