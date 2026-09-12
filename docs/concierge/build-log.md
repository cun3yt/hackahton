# Concierge — build log

Stage-by-stage record of the build in [`dev-plan.md`](dev-plan.md). Each stage ends with checks anyone can rerun. After each stage the build stops; the next one starts only when Cuneyt or Oskar confirms.

**How to follow along:** `git log --oneline` shows one commit per stage (`build(sN): …`). Each stage below lists the files changed, how to check it, and what we saw.

## Stages

| Stage | Dev-plan milestone | Goal | Status |
|---|---|---|---|
| S1 | M0 P1 | Next.js + CopilotKit runtime + chat popup answers "hi" | review |
| S2 | M0 both | `lib/contracts.ts`: tool result types + fixture data | todo |
| S3 | M0 P2 | Seed Ambiguous: demo company Wiki pages, sales channel (writes to the real workspace) | todo |
| S4 | M1 P1 | Ambiguous client + `search_knowledge`, `create_lead`, `notify_team` + smoke script | todo |
| S5 | M1 P2 | Acme website sections + `SourceCard`, `LeadCard` → checkpoint: Flow A without booking | todo |
| S6 | M2 | Booking: `get_slots`, `choose_slot` (SlotPicker), `book_meeting` (BookedCard) | todo |
| S7 | M2 | Flow E: `capture_email` (EmailCapture), `log_gap` (GapCard) | todo |
| S8 | M2 | Flow B playbook via `useAgentContext` + X1 `highlight_plan` → feature freeze | todo |
| S9 | M3 | `scripts/reset-demo.ts` + split-screen setup | todo |
| S10 | M4 | Rehearse twice, backup video | todo |

---

## S1 — scaffold + chat reply

**Goal:** the Next.js app runs on `localhost:3000`, the CopilotKit runtime lists the `default` agent, and the popup streams a Claude reply to "hi".

**Files**

| File | What |
|---|---|
| `package.json`, `package-lock.json` | Next.js 16.3.5, React 19.2.8, Tailwind 4, `@copilotkit/react-core@1.71.1`, `@copilotkit/runtime@1.71.1`, `zod@3` |
| `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `public/` | `create-next-app` defaults (scaffolded in a temp folder, moved in) |
| `AGENTS.md`, `CLAUDE.md` | Written by `create-next-app`: tells coding agents to read `node_modules/next/dist/docs/` because Next 16 differs from their training data |
| `.gitignore` | Merged ours with Next's; also ignores `.idea/` |
| `app/api/copilotkit/[[...slug]]/route.ts` | Copilot Runtime with one agent named `default` |
| `lib/agent.ts` | `BuiltInAgent`, `maxSteps: 8`, placeholder prompt. Model from `CONCIERGE_MODEL`, default `anthropic:claude-sonnet-5` |
| `app/layout.tsx` | `CopilotKitProvider` + CopilotKit v2 styles |
| `app/page.tsx` | Placeholder page (real Acme site in S5) |
| `components/concierge/ConciergeWidget.tsx` | `CopilotPopup` |

**Check it**

```bash
npm install                                   # ~16 min on first run (1,592 packages)
npm run dev                                   # port 3000; if taken: npx next dev -p 3100
curl -s localhost:3000/api/copilotkit/info    # lists "default"
npx tsc --noEmit && npm run lint              # both clean
# open http://localhost:3000, click the chat bubble, type "hi"
```

**Result (2026-09-12, Cuneyt's machine, port 3100 because another app holds 3000)**

| Check | Seen |
|---|---|
| `GET /api/copilotkit/info` | `200`, `"agents":{"default":{"className":"BuiltInAgent", …}}`, version `1.71.1` |
| Chat "hi" | `POST /api/copilotkit/agent/default/run 200 in 1559ms`; reply "Hi there! Welcome to Acme — how can I help you today?" |
| Model | `anthropic:claude-sonnet-5` accepted by the bundled `@ai-sdk/anthropic`; no fallback needed |
| `tsc --noEmit`, `eslint` | Clean |

![S1: popup replies to "hi"](build/s1-chat-hi.jpg)

**Notes for later stages**

- The dev log prints an AI SDK warning about system messages in `messages`. It comes from CopilotKit's `BuiltInAgent` and is harmless.
- CopilotKit runtime telemetry is on by default. To turn it off, add `COPILOTKIT_TELEMETRY_DISABLED=true` to `.env.local`.
- Use `localhost`, not `127.0.0.1`: Next 16 blocks dev resources (HMR) from other origins unless they're listed in `allowedDevOrigins`.
- The `BuiltInAgent` instance lives at module scope, so it handles one run at a time. That's fine for a single-visitor demo (`copilotkit-context.md` gotcha 3).
