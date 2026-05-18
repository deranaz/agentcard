"use client";

import { shortPath } from "@/lib/utils";
import type { SessionStats } from "@/lib/types";

type Props = {
  stats: SessionStats;
};

const KIND_LABEL = {
  created: "+",
  modified: "~",
  deleted: "−",
};

const KIND_CLASS = {
  created: "text-emerald-400",
  modified: "text-sky-400",
  deleted: "text-rose-400",
};

export function CardFiles({ stats }: Props) {
  if (!stats.files.length) return null;

  const top = stats.files.slice(0, 8);
  const overflow = stats.files.length - top.length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          FILES
        </div>
        <div className="text-[10px] font-mono text-zinc-600">
          {stats.files.length} total
        </div>
      </div>
      <ul className="mt-3 space-y-1.5 font-mono text-[12px]">
        {top.map((f) => (
          <li key={f.path} className="flex items-center gap-2">
            <span className={`w-3 shrink-0 ${KIND_CLASS[f.kind]}`}>
              {KIND_LABEL[f.kind]}
            </span>
            <span className="text-zinc-300 truncate">{shortPath(f.path, 48)}</span>
          </li>
        ))}
        {overflow > 0 && (
          <li className="pt-1 text-[11px] text-zinc-500">
            … +{overflow} more
          </li>
        )}
      </ul>
    </div>
  );
}
