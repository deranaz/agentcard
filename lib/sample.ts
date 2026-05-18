import type { SessionStats } from "./types";

const HERMES_SAMPLE: SessionStats = {
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

const CLAUDE_SAMPLE: SessionStats = {
  title: "Migrate REST endpoints to tRPC with Zod validation",
  agent: "Claude Code",
  model: "claude-sonnet-4.6",
  startedAt: "2026-05-12T09:15:00Z",
  durationSec: 4220,
  messages: 89,
  toolCalls: 58,
  tokensIn: 312_500,
  tokensOut: 71_200,
  tools: [
    { name: "Read", count: 22 },
    { name: "Edit", count: 18 },
    { name: "Bash", count: 9 },
    { name: "Glob", count: 5 },
    { name: "Write", count: 4 },
  ],
  files: [
    { path: "server/router/index.ts", kind: "created" },
    { path: "server/router/users.ts", kind: "created" },
    { path: "server/router/posts.ts", kind: "created" },
    { path: "server/schemas/user.ts", kind: "created" },
    { path: "server/schemas/post.ts", kind: "created" },
    { path: "client/api/trpc.ts", kind: "created" },
    { path: "server/routes/users.ts", kind: "deleted" },
    { path: "server/routes/posts.ts", kind: "deleted" },
  ],
  outcome: "success",
  summary:
    "Replaced 14 REST handlers with tRPC routers. Added Zod schemas for inputs and outputs. Type safety end-to-end, 30% less client code.",
  source: "claude",
};

const CODEX_SAMPLE: SessionStats = {
  title: "Fix flaky integration tests on CI",
  agent: "Codex CLI",
  model: "gpt-5.5-mini",
  startedAt: "2026-05-15T22:08:00Z",
  durationSec: 920,
  messages: 24,
  toolCalls: 17,
  tokensIn: 68_400,
  tokensOut: 14_900,
  tools: [
    { name: "shell", count: 9 },
    { name: "apply_patch", count: 5 },
    { name: "view", count: 3 },
  ],
  files: [
    { path: "tests/integration/queue.test.ts", kind: "modified" },
    { path: "tests/helpers/wait.ts", kind: "created" },
    { path: ".github/workflows/test.yml", kind: "modified" },
  ],
  outcome: "partial",
  summary:
    "Stabilized 3 of 4 flaky tests by replacing setTimeout with poll-and-assert helper. One race in pubsub still investigating.",
  source: "generic",
};

export const SAMPLES: Record<string, SessionStats> = {
  hermes: HERMES_SAMPLE,
  claude: CLAUDE_SAMPLE,
  codex: CODEX_SAMPLE,
};

export const SAMPLE_STATS = HERMES_SAMPLE;
