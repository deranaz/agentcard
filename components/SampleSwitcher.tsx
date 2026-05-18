"use client";

import { cn } from "@/lib/utils";
import { SAMPLES } from "@/lib/sample";

type Props = {
  active: string | null;
  onPick: (key: string) => void;
};

const LABELS: Record<string, string> = {
  hermes: "Hermes",
  claude: "Claude Code",
  codex: "Codex CLI",
};

export function SampleSwitcher({ active, onPick }: Props) {
  const keys = Object.keys(SAMPLES);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
        sample
      </span>
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onPick(k)}
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.15em] transition",
            active === k
              ? "border-violet-400/50 bg-violet-400/10 text-violet-200"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
          )}
        >
          {LABELS[k] || k}
        </button>
      ))}
    </div>
  );
}
