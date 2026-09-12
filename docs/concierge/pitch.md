# Concierge — pitch script

Spoken intro (~60 seconds) delivered right before the 3-minute demo in [`demo-plan.md`](demo-plan.md). Problem → what we built → how it works → hand-off to the demo.

---

## Hook

> Right now, someone is on a company's website with a question, and nobody's there to answer it.

## The problem

> Ambiguous clients already run their business in Ambiguous. Their knowledge is in the Wiki, their pipeline is in the CRM, and their team talks in Chat.
>
> But their website knows none of that. Visitors get a contact form, or a chatbot reading an old FAQ. Leads wait. Someone types the details into the CRM by hand. And nobody finds out which questions went unanswered.

## What we built

> We built **Concierge**: a website agent for every Ambiguous client, running on that client's own workspace.

## How it works

> It does three things.
>
> **It knows.** It answers from the company's Wiki, live, and shows its sources.
>
> **It acts.** It qualifies the lead, creates the deal, books the meeting and alerts sales. When it can't answer, it creates a task so the team can fill the gap.
>
> **It shows.** Instead of walls of text, it shows real interface: lead cards, a meeting picker, and it even highlights the right plan on the page. That's generative UI, built with CopilotKit.
>
> And the company controls it in plain language, from one Wiki page. No code.

## Lead into the demo

> On the left is Acme's website. On the right is Acme's Ambiguous workspace. Keep your eyes on the right.

*(3-minute demo — see [`demo-plan.md`](demo-plan.md#3-minute-demo-script))*

## Closing line

> Every Ambiguous client gets a website agent that works on their own data, and routine calls cost them zero AI actions.

---

## Adjust to what gets built

| Line | Depends on | If not built |
|---|---|---|
| "it even highlights the right plan on the page" | Extra X1 (agent drives the page) | Cut the phrase |
| "When it can't answer, it creates a task so the team can fill the gap" | Flow E | Cut the sentence |
| "books the meeting" | Flow A booking (or the Task fallback) | Say "sets up the meeting" |
| "controls it in plain language, from one Wiki page" | Flow B | Cut the sentence |
| "routine calls cost them zero AI actions" | No premium operations (web search, image generation) in the demo | Drop the claim; source: Ambiguous pricing, external agents' routine CRUD is free |
