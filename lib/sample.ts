import type { SessionStats } from "./types";

export const SAMPLE_STATS: SessionStats = {
  title: "Refactor auth middleware to use JWT rotation",
  agent: "Hermes Agent",
  model: "claude-opus-4.7-thinking-agentic",
  startedAt: "2026-05-18T13:42:00Z",
  durationSec: 1842,
  messages: 47,
  toolCalls: 31,
  tokensIn: 184_000,
  tokensOut: 42_300,
  tools: [
    { name: "read_file", count: 12 },
    { name: "patch", count: 8 },
    { name: "terminal", count: 6 },
    { name: "search_files", count: 3 },
    { name: "write_file", count: 2 },
  ],
  files: [
    { path: "src/middleware/auth.ts", kind: "modified" },
    { path: "src/lib/jwt.ts", kind: "created" },
    { path: "src/lib/jwt.test.ts", kind: "created" },
    { path: "src/routes/refresh.ts", kind: "modified" },
    { path: "src/types/session.ts", kind: "modified" },
    { path: ".env.example", kind: "modified" },
  ],
  outcome: "success",
  summary:
    "Migrated middleware to rotating JWTs with 15min access + 7d refresh. Added tests for replay attacks and clock skew. All 142 tests pass.",
  source: "hermes",
};
