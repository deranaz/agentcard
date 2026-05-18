"use client";

import { cn, shortPath } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";
import type { Theme } from "@/lib/themes";

type Props = {
  stats: SessionStats;
  theme: Theme;
};

const KIND_LABEL = {
  created: "+",
  modified: "~",
  deleted: "−",
};

export function CardFiles({ stats, theme }: Props) {
  if (!stats.files.length) return null;

  const wrap =
    theme === "mono"
      ? "border-zinc-200 bg-zinc-50"
      : theme === "terminal"
        ? "border-emerald-500/20 bg-emerald-500/5"
        : "border-white/10 bg-white/5";

  const muted = theme === "mono" ? "text-zinc-500" : "opacity-60";

  const kindClass = (k: keyof typeof KIND_LABEL) => {
    if (theme === "terminal") {
      return k === "created"
        ? "text-emerald-300"
        : k === "modified"
          ? "text-cyan-300"
          : "text-rose-300";
    }
    if (theme === "mono") {
      return "text-zinc-900";
    }
    return k === "created"
      ? "text-emerald-400"
      : k === "modified"
        ? "text-sky-400"
        : "text-rose-400";
  };

  const top = stats.files.slice(0, 8);
  const overflow = stats.files.length - top.length;

  return (
    <div className={cn("rounded-2xl border p-4", wrap)}>
      <div className="flex items-baseline justify-between">
        <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em]", muted)}>
          FILES
        </div>
        <div className={cn("text-[10px] font-mono", muted)}>
          {stats.files.length} total
        </div>
      </div>
      <ul className="mt-3 space-y-1.5 font-mono text-[12px]">
        {top.map((f) => (
          <li key={f.path} className="flex items-center gap-2">
            <span className={cn("w-3 shrink-0", kindClass(f.kind))}>
              {KIND_LABEL[f.kind]}
            </span>
            <span className="truncate">{shortPath(f.path, 48)}</span>
          </li>
        ))}
        {overflow > 0 && (
          <li className={cn("pt-1 text-[11px]", muted)}>… +{overflow} more</li>
        )}
      </ul>
    </div>
  );
}
