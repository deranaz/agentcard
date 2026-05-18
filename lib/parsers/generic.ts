import type { SessionStats, ToolUse } from "../types";
import type { ParseResult } from "./index";

// Generic fallback: tries to extract anything useful from JSON or plain text.
// Used when the input doesn't match Hermes/Claude shapes.

export function parseGeneric(raw: string, json?: unknown): ParseResult {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    return fromGenericJson(json as Record<string, unknown>);
  }
  return fromText(raw);
}

function fromGenericJson(obj: Record<string, unknown>): ParseResult {
  const messages =
    Array.isArray(obj.messages) ? obj.messages.length :
    Array.isArray(obj.events) ? obj.events.length : 0;

  const tools = extractTools(obj);
  const stats: SessionStats = {
    title: (obj.title as string) || (obj.name as string) || "Agent session",
    agent: (obj.agent as string) || "Unknown agent",
    model: (obj.model as string) || "unknown",
    messages,
    toolCalls: tools.reduce((a, b) => a + b.count, 0),
    tools,
    files: [],
    source: "generic",
  };
  return { ok: true, stats };
}

function fromText(raw: string): ParseResult {
  const lines = raw.split("\n").filter(Boolean);
  // Heuristic: lines like "tool: <name>" or "calling <tool>"
  const toolMap = new Map<string, number>();
  const fileSet = new Set<string>();
  for (const ln of lines) {
    const m1 = /(?:calling|tool[:\s]+)([a-zA-Z_][\w.-]+)/.exec(ln);
    if (m1) toolMap.set(m1[1], (toolMap.get(m1[1]) || 0) + 1);
    const m2 = /(?:^|\s)([./~][\w./-]+\.[a-z]{1,5})\b/.exec(ln);
    if (m2) fileSet.add(m2[1]);
  }
  const tools: ToolUse[] = Array.from(toolMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const stats: SessionStats = {
    title: lines[0]?.slice(0, 70) || "Plain text session",
    agent: "Generic agent",
    model: "unknown",
    messages: lines.length,
    toolCalls: tools.reduce((a, b) => a + b.count, 0),
    tools,
    files: Array.from(fileSet).map((p) => ({ path: p, kind: "modified" as const })),
    source: "generic",
  };
  return { ok: true, stats };
}

function extractTools(obj: Record<string, unknown>): ToolUse[] {
  const t = obj.tools;
  if (!Array.isArray(t)) return [];
  return t
    .filter((x): x is { name: string; count?: number } =>
      !!x && typeof x === "object" && "name" in (x as object),
    )
    .map((x) => ({ name: x.name, count: x.count ?? 1 }));
}
