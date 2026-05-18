# AgentCard

> Share what your AI agent built — in one card.

Drop an agent session log. Get a beautiful, shareable card with stats, tools,
files, and outcome. Built with agents, for agents.

![AgentCard preview](docs/preview.png)

## Why

Agent runs are getting longer, more autonomous, and harder to communicate to
teammates, reviewers, or grant programs. Transcripts are too long to share. A
text summary loses the proof. AgentCard gives you a single, dense visual that
shows what an agent actually did:

- which agent + model
- how many messages and tool calls
- which tools were used the most
- which files were touched
- what the outcome was
- a one-line summary

Drop it in a PR description, paste it in a Slack channel, tweet it.

## Quickstart

```bash
git clone https://github.com/deranaz/agentcard
cd agentcard
npm install
npm run dev
```

Open http://localhost:3000 and drop a session log into the upload zone.

## Supported log formats

| Source         | Status   | Notes                                    |
| -------------- | -------- | ---------------------------------------- |
| Hermes Agent   | First    | Native session export JSON               |
| Claude Code    | First    | Transcript JSON export                   |
| Codex          | Generic  | Falls through to generic parser          |
| Generic JSON   | Always   | Best-effort field extraction             |
| Plain text log | Always   | Heuristics for tool names + file paths   |

If your log format is missing, drop an issue with a sample and I'll add a
parser.

## Stack

- Next.js 16 (App Router, webpack)
- React 19
- Tailwind v4
- TypeScript strict
- `html-to-image` for PNG export

No backend. Everything runs client-side. Logs never leave your browser.

## Roadmap

- [x] Hermes + Claude + generic parsers
- [x] PNG export
- [x] Sample mode
- [ ] More themes (light, mono, terminal)
- [ ] Codex CLI native parser
- [ ] Public share URLs (`/c/<id>`)
- [ ] OG image API for embedding in READMEs
- [ ] CLI: `npx agentcard ./log.json`

## Built with

This project itself was built end-to-end with [Hermes Agent](https://hermes-agent.nousresearch.com)
in a single session, using `claude-opus-4.7-thinking-agentic` as the model. The
session log that produced AgentCard is in `docs/built-with-agent.json` — drop
it in the app to see the meta card.

## License

MIT.
