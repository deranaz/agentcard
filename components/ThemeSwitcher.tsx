"use client";

import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/themes";

type Props = {
  active: Theme;
  onPick: (t: Theme) => void;
};

const KEYS: Theme[] = ["midnight", "mono", "terminal"];

export function ThemeSwitcher({ active, onPick }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
        theme
      </span>
      {KEYS.map((t) => (
        <button
          key={t}
          onClick={() => onPick(t)}
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.15em] transition",
            active === t
              ? "border-sky-400/50 bg-sky-400/10 text-sky-200"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
