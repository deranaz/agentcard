import type { SessionStats, ToolUse, FileChange } from "../types";
import type { ParseResult } from "./index";

// Claude Code transcript export shape (subset).
type ClaudeEvent = {
  type: string; // "message" | "tool_use" | "tool_result"
  role?: "user" | "assistant";
  text?: string;
  tool?: string;
  name?: string;
  input?: Record<string, unknown>;
  timestamp?: string | number;
};

type ClaudeExport = {
  title?: string;
  model?: string;
  started_at?: string | number;
  ended_at?: string | number;
  transcript?: ClaudeEvent[];
  events?: ClaudeEvent[];
  tool_use_count?: number;
  tokens_in?: number;
  tokens_out?: number;
};

export function parseClaude(input: unknown): ParseResult {
  const data = input as ClaudeExport;
  const events = data.transcript || data.events || [];
  if (!Array.isArray(events)) {
    return { ok: false, error: "Not a valid Claude transcript" };
  }

  const toolMap = new Map<string, number>();
  const filesSet = new Set<string>();
  let toolCalls = 0;
  let messages = 0;

  for (const e of events) {
    if (e.type === "message") {
      messages += 1;
    } else if (e.type === "tool_use") {
      const name = (e.name || e.tool || "unknown").toString();
      toolMap.set(name, (toolMap.get(name) || 0) + 1);
      toolCalls += 1;
      const path =
        (e.input?.path as string) ||
        (e.input?.file_path as string) ||
        (e.input?.filePath as string);
      if (path) filesSet.add(path);
    }
  }

  const tools: ToolUse[] = Array.from(toolMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const files: FileChange[] = Array.from(filesSet).map((p) => ({
    path: p,
    kind: "modified" as const,
  }));

  const start = data.started_at;
  const end = data.ended_at;
  const startMs = start
    ? typeof start === "number"
      ? start
      : Date.parse(start)
    : NaN;
  const endMs = end
    ? typeof end === "number"
      ? end
      : Date.parse(end)
    : NaN;
  const durationSec =
    !isNaN(startMs) && !isNaN(endMs)
      ? Math.max(0, Math.floor((endMs - startMs) / 1000))
      : undefined;

  const lastAssistant = [...events]
    .reverse()
    .find((e) => e.type === "message" && e.role === "assistant" && e.text);

  const stats: SessionStats = {
    title: data.title || firstUserText(events) || "Untitled session",
    agent: "Claude Code",
    model: data.model || "claude",
    startedAt: !isNaN(startMs) ? new Date(startMs).toISOString() : undefined,
    durationSec,
    messages,
    toolCalls: data.tool_use_count ?? toolCalls,
    tokensIn: data.tokens_in,
    tokensOut: data.tokens_out,
    tools,
    files,
    outcome: lastAssistant ? inferOutcome(lastAssistant.text || "") : "unknown",
    summary: lastAssistant ? snippet(lastAssistant.text || "") : undefined,
    source: "claude",
  };

  return { ok: true, stats };
}

function firstUserText(events: ClaudeEvent[]): string | undefined {
  const u = events.find((e) => e.type === "message" && e.role === "user" && e.text);
  if (!u || !u.text) return undefined;
  const t = u.text.trim().split("\n")[0];
  return t.length > 70 ? t.slice(0, 67) + "…" : t;
}

function snippet(s: string): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > 160 ? t.slice(0, 157) + "…" : t;
}

function inferOutcome(s: string): SessionStats["outcome"] {
  const c = s.toLowerCase();
  if (/error|failed|cannot|gagal/.test(c)) return "partial";
  if (/done|selesai|fixed|deployed|merged|✓/.test(c)) return "success";
  return "unknown";
}
