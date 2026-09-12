# Docs

Context for our hackathon project: **Concierge**, a customer-facing AI agent for Ambiguous (ambiguous.ai) clients, built with CopilotKit. Written for both teammates and coding agents. Collected 2026-09-12.

## Read this when

| Doc | Read when |
|---|---|
| [`concierge/demo-plan.md`](concierge/demo-plan.md) | Hackathon build: demo flows (with diagrams), 3-minute script, 3-hour plan, cuts, fallbacks |
| [`concierge/concierge-design.md`](concierge/concierge-design.md) | Start here. Product idea, architecture, design decisions, generative UI catalog, hackathon plan, open questions |
| [`ambiguous/ambiguous-context.md`](ambiguous/ambiguous-context.md) | Calling Ambiguous (REST, CLI, MCP), auth and API keys, event listening, sandbox, pricing |
| [`copilotkit/copilotkit-context.md`](copilotkit/copilotkit-context.md) | Writing CopilotKit code: v2 runtime, hooks, generative UI, MCP, wiring to Ambiguous |

Each context doc ends with a table of the vendor's original docs saved under its `raw/` folder.

## Key facts at a glance

- **Ambiguous**: 17 workspace apps for humans + AI coworkers. One REST API (939 paths) at `https://app.ambiguous.ai`, also exposed as CLI (`npx ambiguous@latest`) and MCP (`https://app.ambiguous.ai/mcp`, 856 tools). API keys look like `ak_…`.
- **CopilotKit**: React UI → Copilot Runtime (your server) → agent, over the AG-UI protocol. Current packages 1.71.1. **Use the v2 API only** (`@copilotkit/react-core/v2`, `@copilotkit/runtime/v2`); most examples online are deprecated v1.
- **Cost**: our backend is an external agent, so routine Ambiguous CRUD calls don't consume the client's AI actions. We pay only the LLM bill.
- **Try without an account**: Ambiguous sandbox, `POST https://app.ambiguous.ai/sandbox/session` (tasks CRUD only, 1-hour session).

## Team setup (Claude Code)

```bash
claude plugin marketplace add ambiguous-ai/plugins
claude plugin install ambiguous
npx ambiguous@latest auth login --token ak_…   # key from "Connect" in the Ambiguous workspace
npx ambiguous@latest whoami
```

Credentials land in `./.ambi/config.json` (auto-gitignored). Keep `ak_` keys and model API keys out of this repo.

## Open decisions

See `concierge/concierge-design.md` §9: order data source, visitor identity, distribution model.
