import type { SessionStats, ToolUse, FileChange } from "../types";
import type { ParseResult } from "./index";

// Hermes session export shape (subset we care about).
type HermesMessage = {
  role: "user" | "assistant" | "tool" | "system";
  content?: unknown;
  tool_calls?: Array<{ name?: string; tool?: string }>;
  timestamp?: string | number;
};

type HermesExport = {
  session_id?: string;
  title?: string;
  agent?: string;
  model?: string;
  provider?: string;
  started_at?: string | number;
  ended_at?: string | number;
  messages: HermesMessage[];
  tokens_in?: number;
  tokens_out?: number;
  files_touched?: string[];
};

export function parseHermes(input: unknown): ParseResult {
  const data = input as HermesExport;
  if (!data || !Array.isArray(data.messages)) {
    return { ok: false, error: "Not a valid Hermes export" };
  }

  const toolMap = new Map<string, number>();
  let toolCalls = 0;

  for (const m of data.messages) {
    if (Array.isArray(m.tool_calls)) {
      for (const tc of m.tool_calls) {
        const name = (tc.name || tc.tool || "unknown").toString();
        toolMap.set(name, (toolMap.get(name) || 0) + 1);
        toolCalls += 1;
      }
    }
  }

  const tools: ToolUse[] = Array.from(toolMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const files: FileChange[] = (data.files_touched || []).map((p) => ({
    path: p,
    kind: "modified" as const,
  }));

  const durationSec = computeDuration(data.started_at, data.ended_at);

  const stats: SessionStats = {
    title: data.title || sessionTitleFromMessages(data.messages),
    agent: "Hermes Agent",
    model: data.model || "unknown",
    startedAt: toIso(data.started_at),
    durationSec,
    messages: data.messages.length,
    toolCalls,
    tokensIn: data.tokens_in,
    tokensOut: data.tokens_out,
    tools,
    files,
    outcome: inferOutcome(data.messages),
    summary: firstAssistantSnippet(data.messages),
    source: "hermes",
  };

  return { ok: true, stats };
}

function computeDuration(
  start?: string | number,
  end?: string | number,
): number | undefined {
  if (!start || !end) return undefined;
  const a = typeof start === "number" ? start : Date.parse(start);
  const b = typeof end === "number" ? end : Date.parse(end);
  if (isNaN(a) || isNaN(b)) return undefined;
  return Math.max(0, Math.floor((b - a) / 1000));
}

function toIso(t?: string | number): string | undefined {
  if (!t) return undefined;
  const d = typeof t === "number" ? new Date(t) : new Date(t);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function sessionTitleFromMessages(msgs: HermesMessage[]): string {
  const first = msgs.find((m) => m.role === "user");
  if (!first || typeof first.content !== "string") return "Untitled session";
  const t = first.content.trim().split("\n")[0];
  return t.length > 70 ? t.slice(0, 67) + "…" : t;
}

function firstAssistantSnippet(msgs: HermesMessage[]): string | undefined {
  const last = [...msgs].reverse().find(
    (m) => m.role === "assistant" && typeof m.content === "string",
  );
  if (!last || typeof last.content !== "string") return undefined;
  const t = last.content.trim().replace(/\s+/g, " ");
  return t.length > 160 ? t.slice(0, 157) + "…" : t;
}

function inferOutcome(
  msgs: HermesMessage[],
): SessionStats["outcome"] {
  // Naive heuristic — last assistant message tone.
  const last = [...msgs].reverse().find((m) => m.role === "assistant");
  if (!last || typeof last.content !== "string") return "unknown";
  const c = last.content.toLowerCase();
  if (/error|failed|cannot|tidak bisa|gagal/.test(c)) return "partial";
  if (/done|done\.|selesai|fixed|deployed|merged/.test(c)) return "success";
  return "unknown";
}
