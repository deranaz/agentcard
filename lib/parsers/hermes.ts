import type { SessionStats, ToolUse, FileChange } from "../types";
import type { ParseResult } from "./index";

// Hermes session export shape (subset we care about).
// OpenAI-style tool call (real `hermes sessions export`)
type OpenAIToolCall = {
  id?: string;
  type?: string;
  function?: { name?: string; arguments?: string };
};

// Legacy / sample shape we've seen in docs/built-with-agent.json
type LegacyToolCall = { name?: string; tool?: string };

type AnyToolCall = OpenAIToolCall & LegacyToolCall;

type HermesMessage = {
  role: "user" | "assistant" | "tool" | "system";
  content?: unknown;
  tool_calls?: AnyToolCall[] | string | null;
  tool_name?: string | null;
  timestamp?: string | number;
};

type HermesExport = {
  id?: string;
  session_id?: string;
  title?: string;
  agent?: string;
  model?: string;
  provider?: string;
  // Real export uses unix seconds (number); legacy/sample uses ISO string.
  started_at?: string | number;
  ended_at?: string | number;
  messages: HermesMessage[] | string;
  // Token alias variants (real export uses input_tokens/output_tokens).
  tokens_in?: number;
  tokens_out?: number;
  input_tokens?: number;
  output_tokens?: number;
  // Optional pre-computed files (legacy sample shape).
  files_touched?: string[];
  // Real export also carries these counts at the top level.
  message_count?: number;
  tool_call_count?: number;
};

export function parseHermes(input: unknown): ParseResult {
  const data = input as HermesExport;
  if (!data) return { ok: false, error: "Not a valid Hermes export" };

  // Real export sometimes serializes messages as a JSON string.
  let messages: HermesMessage[];
  if (Array.isArray(data.messages)) {
    messages = data.messages;
  } else if (typeof data.messages === "string") {
    try {
      messages = JSON.parse(data.messages) as HermesMessage[];
    } catch {
      return { ok: false, error: "Hermes export: messages field unparseable" };
    }
  } else {
    return { ok: false, error: "Not a valid Hermes export" };
  }
  if (!Array.isArray(messages)) {
    return { ok: false, error: "Hermes export: messages must be an array" };
  }

  const toolMap = new Map<string, number>();
  const fileSet = new Map<string, FileChange["kind"]>();
  let toolCalls = 0;

  for (const m of messages) {
    const calls = normalizeToolCalls(m.tool_calls);
    for (const tc of calls) {
      const name = pickToolName(tc) || m.tool_name || "unknown";
      toolMap.set(name, (toolMap.get(name) || 0) + 1);
      toolCalls += 1;
      // Best-effort: extract file paths from tool arguments.
      collectFilesFromToolCall(tc, name, fileSet);
    }
  }

  const tools: ToolUse[] = Array.from(toolMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Prefer pre-computed files_touched if export provides it; fall back to
  // tool-call argument scraping.
  const files: FileChange[] =
    data.files_touched && data.files_touched.length > 0
      ? data.files_touched.map((p) => ({ path: p, kind: "modified" as const }))
      : Array.from(fileSet.entries()).map(([path, kind]) => ({ path, kind }));

  const durationSec = computeDuration(data.started_at, data.ended_at);

  const tokensIn = data.input_tokens ?? data.tokens_in;
  const tokensOut = data.output_tokens ?? data.tokens_out;

  const stats: SessionStats = {
    title: data.title || sessionTitleFromMessages(messages),
    agent: "Hermes Agent",
    model: data.model || "unknown",
    startedAt: toIso(data.started_at),
    durationSec,
    messages: data.message_count ?? messages.length,
    toolCalls: data.tool_call_count ?? toolCalls,
    tokensIn,
    tokensOut,
    tools,
    files,
    outcome: inferOutcome(messages),
    summary: lastAssistantSnippet(messages),
    source: "hermes",
  };

  return { ok: true, stats };
}

function normalizeToolCalls(
  raw: HermesMessage["tool_calls"],
): AnyToolCall[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as AnyToolCall[]) : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

function pickToolName(tc: AnyToolCall): string | undefined {
  return tc.function?.name || tc.name || tc.tool;
}

// Tools that operate on file paths. We pull the path/file_path/file argument
// out of `tc.function.arguments` (JSON string) and record a FileChange.
const FILE_TOOL_KINDS: Record<string, FileChange["kind"]> = {
  write_file: "created",
  patch: "modified",
  read_file: "modified",
  search_files: "modified",
};

function collectFilesFromToolCall(
  tc: AnyToolCall,
  toolName: string,
  out: Map<string, FileChange["kind"]>,
): void {
  const kind = FILE_TOOL_KINDS[toolName];
  if (!kind) return;
  const argsRaw = tc.function?.arguments;
  if (!argsRaw || typeof argsRaw !== "string") return;
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(argsRaw) as Record<string, unknown>;
  } catch {
    return;
  }
  const candidates = [args.path, args.file_path, args.file, args.filepath];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) {
      // read_file/search_files shouldn't override a stronger "created"/"modified"
      // already recorded for the same path.
      const existing = out.get(c);
      if (!existing || (existing === "modified" && kind === "created")) {
        out.set(c, kind);
      }
      return;
    }
  }
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

function lastAssistantSnippet(msgs: HermesMessage[]): string | undefined {
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
