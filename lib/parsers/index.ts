import type { SessionStats } from "../types";
import { parseHermes } from "./hermes";
import { parseClaude } from "./claude";
import { parseGeneric } from "./generic";

export type ParseResult = {
  ok: boolean;
  stats?: SessionStats;
  error?: string;
};

// Auto-detects log shape and routes to the right parser.
// Order matters: more specific schemas first.
export function parseSession(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty input" };
  }

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    // Not JSON — try plain-text generic parser.
    return parseGeneric(trimmed);
  }

  if (looksLikeHermes(json)) return parseHermes(json);
  if (looksLikeClaude(json)) return parseClaude(json);
  return parseGeneric(trimmed, json);
}

function looksLikeHermes(j: unknown): boolean {
  if (!j || typeof j !== "object") return false;
  const obj = j as Record<string, unknown>;
  // Hermes session export typically has these keys.
  return (
    "messages" in obj &&
    Array.isArray(obj.messages) &&
    typeof obj === "object" &&
    ("model" in obj || "agent" in obj || "session_id" in obj)
  );
}

function looksLikeClaude(j: unknown): boolean {
  if (!j || typeof j !== "object") return false;
  const obj = j as Record<string, unknown>;
  // Claude Code transcript export shape.
  if (Array.isArray(obj)) return false;
  return (
    ("transcript" in obj && Array.isArray(obj.transcript)) ||
    ("events" in obj && Array.isArray(obj.events) && "tool_use_count" in obj)
  );
}
