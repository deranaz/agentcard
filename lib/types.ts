// Core data shape for a parsed agent session.
// Parsers from different sources (Hermes, Claude, Codex, generic) all
// normalize into this single SessionStats object.

export type ToolUse = {
  name: string;
  count: number;
};

export type FileChange = {
  path: string;
  kind: "created" | "modified" | "deleted";
};

export type SessionStats = {
  // Header
  title: string;
  agent: string; // e.g. "Hermes Agent", "Claude Code"
  model: string; // e.g. "claude-opus-4.7"
  startedAt?: string; // ISO
  durationSec?: number;

  // Volume
  messages: number;
  toolCalls: number;
  tokensIn?: number;
  tokensOut?: number;

  // Surface
  tools: ToolUse[];
  files: FileChange[];

  // Outcome
  outcome?: "success" | "partial" | "failed" | "unknown";
  summary?: string; // 1-2 lines, human readable

  // Source
  source: "hermes" | "claude" | "codex" | "generic";
};

export const EMPTY_STATS: SessionStats = {
  title: "Untitled session",
  agent: "Unknown agent",
  model: "Unknown model",
  messages: 0,
  toolCalls: 0,
  tools: [],
  files: [],
  source: "generic",
};
