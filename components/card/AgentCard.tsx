"use client";

import { forwardRef } from "react";
import { CardHeader } from "./CardHeader";
import { CardStats } from "./CardStats";
import { CardTools } from "./CardTools";
import { CardFiles } from "./CardFiles";
import type { SessionStats } from "@/lib/types";
import type { Theme, ThemeSpec } from "@/lib/themes";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

type Props = {
  stats: SessionStats;
  theme?: Theme;
};

export const AgentCard = forwardRef<HTMLDivElement, Props>(function AgentCard(
  { stats, theme = "midnight" },
  ref,
) {
  const spec = THEMES[theme];
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl shadow-black/40",
        spec.cardClass,
      )}
      style={{ width: 720, maxWidth: "100%" }}
    >
      {theme === "midnight" && (
        <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
      )}
      <div className="relative space-y-6">
        <CardHeader stats={stats} spec={spec} />
        {stats.summary && (
          <p
            className={cn(
              "text-sm leading-relaxed line-clamp-3",
              theme === "mono" ? "text-zinc-700" : "opacity-90",
            )}
          >
            {stats.summary}
          </p>
        )}
        <CardStats stats={stats} theme={theme} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CardTools stats={stats} spec={spec} theme={theme} />
          <CardFiles stats={stats} theme={theme} />
        </div>
        <Footer source={stats.source} theme={theme} />
      </div>
    </div>
  );
});

function Footer({ source, theme }: { source: SessionStats["source"]; theme: Theme }) {
  const muted =
    theme === "mono"
      ? "text-zinc-500 border-zinc-200"
      : theme === "terminal"
        ? "text-emerald-300/60 border-emerald-500/20"
        : "text-zinc-500 border-white/5";
  return (
    <div className={cn("flex items-center justify-between border-t pt-4 text-[10px] font-mono uppercase tracking-[0.2em]", muted)}>
      <span>via {source}</span>
      <span className={theme === "mono" ? "text-zinc-700" : theme === "terminal" ? "text-emerald-300" : "text-zinc-400"}>
        agentcard.dev
      </span>
    </div>
  );
}

export type { ThemeSpec };
