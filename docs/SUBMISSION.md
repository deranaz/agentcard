# 100T Grant Submission — AgentCard

## Form fields

### 01 Email
binancetiga2@gmail.com  (GitHub-linked)

### 02 Agent tool used most
Hermes Agent

### 03 Primary model series
Claude  (claude-opus-4.7-thinking-agentic, via custom 9Router)

### 04 Description (100+ words, target 200-300)

I built **AgentCard**, a tool that turns AI agent session logs into beautiful,
shareable cards — stats, tools, files changed, outcome — ready for Twitter,
README, or team channels. The core problem: agents do a lot of work, but the
output is a wall of text. There is no clean way to *show* what an agent built.
AgentCard fixes that in one drop-and-share flow.

The whole project was built with Hermes Agent in a single session. The agent
scaffolded the Next.js + TypeScript + Tailwind app, wrote four parsers
(Hermes JSON, Claude Code transcript, Codex CLI, generic JSON/text), three
themes (midnight, mono, terminal), client-side PNG export with html-to-image,
share URLs encoded in the URL hash, and a GitHub Actions workflow that
deploys to GitHub Pages on every push. The agent ran ~64 tool calls, wrote
~30 files, hit a real Vercel queue stall and pivoted to GitHub Pages without
breaking flow — exactly the kind of long-chain reasoning + autonomous
recovery this grant is looking for.

The meta proof: AgentCard's own build session is one of the sample cards on
the live site. Drop your own log to verify; the parser supports any agent.

### 05 Proof of usage
- Live demo:  https://deranaz.github.io/agentcard/
- Source:     https://github.com/deranaz/agentcard
- Meta card:  docs/meta-card-screenshot.png  (AgentCard's own build session)
- Sample log: docs/built-with-agent.json     (drop into the live app to reproduce)

## Assets to upload (max 5 files, 20MB each)
1. docs/meta-card-screenshot.png    — meta card render (terminal theme)
2. docs/built-with-agent.json       — sample log, drop into live demo
3. (optional) demo GIF — drag-drop → card → download flow
4. (optional) terminal screenshot   — Hermes session
5. (optional) GitHub Actions success screenshot

## URLs to paste in form
- GitHub: https://github.com/deranaz/agentcard
- Live:   https://deranaz.github.io/agentcard/
