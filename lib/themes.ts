export type Theme = "midnight" | "mono" | "terminal";

export const THEMES: Record<Theme, ThemeSpec> = {
  midnight: {
    label: "midnight",
    cardClass: "card-shell text-zinc-100 border-white/10",
    accentBar: "from-violet-500 to-sky-400",
    badgeMap: {
      success: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
      partial: "text-amber-400 border-amber-400/40 bg-amber-400/10",
      failed: "text-rose-400 border-rose-400/40 bg-rose-400/10",
      unknown: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
    },
  },
  mono: {
    label: "mono",
    cardClass:
      "bg-zinc-50 text-zinc-900 border-zinc-200 [--card-muted:#71717a]",
    accentBar: "from-zinc-900 to-zinc-600",
    badgeMap: {
      success: "text-zinc-900 border-zinc-900 bg-zinc-900/5",
      partial: "text-zinc-700 border-zinc-400 bg-zinc-200",
      failed: "text-zinc-50 border-zinc-900 bg-zinc-900",
      unknown: "text-zinc-500 border-zinc-300 bg-zinc-100",
    },
  },
  terminal: {
    label: "terminal",
    cardClass:
      "bg-black text-emerald-300 border-emerald-500/30 font-mono",
    accentBar: "from-emerald-400 to-emerald-600",
    badgeMap: {
      success: "text-emerald-300 border-emerald-500/60 bg-emerald-500/10",
      partial: "text-amber-300 border-amber-500/60 bg-amber-500/10",
      failed: "text-rose-300 border-rose-500/60 bg-rose-500/10",
      unknown: "text-emerald-300/70 border-emerald-500/30 bg-emerald-500/5",
    },
  },
};

export type ThemeSpec = {
  label: string;
  cardClass: string;
  accentBar: string;
  badgeMap: Record<"success" | "partial" | "failed" | "unknown", string>;
};
