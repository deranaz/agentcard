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
shareable cards — stats, tools, files changed, outcome — so the work an agent
actually did becomes legible in one image instead of a wall of text.

The whole project was built with **Hermes Agent** in a single session, and
that's what makes it interesting. Hermes coordinated the entire build inside
one agentic loop: scaffolded a Next.js + TypeScript + Tailwind app, wrote
four parsers (Hermes JSON, Claude Code transcript, Codex CLI, generic
JSON/text) with a single normalized SessionStats contract, three themes
(midnight, mono, terminal), client-side PNG export via html-to-image, and
share URLs encoded in the URL hash — all chained with `terminal`,
`write_file`, surgical `patch`, `read_file`, `browser_navigate` for visual
QA, `process` for background dev servers, and finally `gh` + `vercel` +
GitHub Actions for the deploy pipeline.

What separates Hermes is multi-tool orchestration as the primary loop:
native MCP-style tooling, browser automation alongside terminal and git, and
the discipline to verify (HTTP 200 checks, type-checks, build-checks) before
declaring done. When Vercel's deploy queue stalled mid-session, the agent
diagnosed it, pivoted to GitHub Pages with a static export and a Pages
workflow, and shipped — without losing the build. That recovery is the
loop, not an afterthought.

Meta proof: AgentCard's own build session is a sample card on the live site.

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
