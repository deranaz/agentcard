"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onText: (text: string, filename?: string) => void;
};

export function DropZone({ onText }: Props) {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = useCallback(
    async (files: FileList | null) => {
      setError(null);
      if (!files || !files.length) return;
      const f = files[0];
      if (f.size > 10 * 1024 * 1024) {
        setError("File too large (max 10MB).");
        return;
      }
      try {
        const text = await f.text();
        onText(text, f.name);
      } catch {
        setError("Failed to read file.");
      }
    },
    [onText],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        onFiles(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-2xl border border-dashed p-8 text-center transition",
        hover
          ? "border-violet-400/60 bg-violet-400/5"
          : "border-white/10 bg-white/5 hover:bg-white/[0.07]",
      )}
    >
      <p className="text-sm text-zinc-300">
        Drop a session log here, or
      </p>
      <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-white/15">
        choose file
        <input
          type="file"
          accept=".json,.txt,.log,.md,application/json,text/plain"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>
      <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
        Hermes · Claude Code · Codex · Generic JSON
      </p>
      {error && (
        <p className="mt-3 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
