import { BuiltInAgent } from "@copilotkit/runtime/v2";

// Override with CONCIERGE_MODEL in .env.local if the bundled @ai-sdk/anthropic rejects the default.
export const MODEL = process.env.CONCIERGE_MODEL ?? "anthropic:claude-sonnet-5";

// S1 placeholder prompt. The full Concierge prompt and tools land in later stages (docs/concierge/dev-plan.md).
const PROMPT = `You are Concierge, the website assistant for Acme. Visitors are potential customers.
Reply in at most 2 short sentences.`;

export function createConciergeAgent() {
  return new BuiltInAgent({
    model: MODEL,
    prompt: PROMPT,
    maxSteps: 8,
  });
}
