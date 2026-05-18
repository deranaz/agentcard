"use client";

import { forwardRef } from "react";
import { CardHeader } from "./CardHeader";
import { CardStats } from "./CardStats";
import { CardTools } from "./CardTools";
import { CardFiles } from "./CardFiles";
import type { SessionStats } from "@/lib/types";

type Props = {
  stats: SessionStats;
};

export const AgentCard = forwardRef<HTMLDivElement, Props>(function AgentCard(
  { stats },
  ref,
) {
  return (
    <div
      ref={ref}
      className="card-shell relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-black/40"
      style={{ width: 720, maxWidth: "100%" }}
    >
      <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative space-y-6">
        <CardHeader stats={stats} />
        {stats.summary && (
          <p className="text-sm leading-relaxed text-zinc-300/90 line-clamp-3">
            {stats.summary}
          </p>
        )}
        <CardStats stats={stats} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CardTools stats={stats} />
          <CardFiles stats={stats} />
        </div>
        <Footer source={stats.source} />
      </div>
    </div>
  );
});

function Footer({ source }: { source: SessionStats["source"] }) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
      <span>via {source}</span>
      <span className="text-zinc-400">agentcard.dev</span>
    </div>
  );
}
