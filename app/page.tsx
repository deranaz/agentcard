"use client";

import { useState, useRef } from "react";
import { DropZone } from "@/components/DropZone";
import { AgentCard } from "@/components/card/AgentCard";
import { parseSession } from "@/lib/parsers";
import { SAMPLE_STATS } from "@/lib/sample";
import type { SessionStats } from "@/lib/types";

export default function HomePage() {
  const [stats, setStats] = useState<SessionStats>(SAMPLE_STATS);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleText = (text: string) => {
    const result = parseSession(text);
    if (!result.ok || !result.stats) {
      setError(result.error || "Could not parse this log.");
      return;
    }
    setError(null);
    setStats(result.stats);
  };

  const exportPng = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#09090b",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `agentcard-${slug(stats.title)}.png`;
      a.click();
    } catch (e) {
      setError(`Export failed: ${(e as Error).message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <Hero />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <DropZone onText={handleText} />
          {error && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}
          <button
            onClick={() => setStats(SAMPLE_STATS)}
            className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300"
          >
            ← reset to sample
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <AgentCard ref={cardRef} stats={stats} />
          <div className="flex gap-2">
            <button
              onClick={exportPng}
              disabled={exporting}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-50"
            >
              {exporting ? "exporting…" : "Download PNG"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "session";
}

function Hero() {
  return (
    <header className="space-y-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Built with agents, for agents
      </div>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        Show what your agent built.
      </h1>
      <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-400">
        Drop a session log. Get a beautiful, shareable card with stats, tools,
        files, and outcome — ready for Twitter, README, or your team channel.
      </p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
      <span>agentcard · open source</span>
      <span>v0.1 — early build</span>
    </footer>
  );
}
