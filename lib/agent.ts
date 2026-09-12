import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createLeadTool } from "./tools/create-lead";
import { notifyTeamTool } from "./tools/notify-team";
import { searchKnowledgeTool } from "./tools/search-knowledge";

// Override with CONCIERGE_MODEL in .env.local if the bundled @ai-sdk/anthropic rejects the default.
export const MODEL = process.env.CONCIERGE_MODEL ?? "anthropic:claude-sonnet-5";
const COMPANY = process.env.CONCIERGE_COMPANY ?? "Acme";

// Tool rules for booking (S6), knowledge gaps (S7), playbook and plans (S8) are added in those stages.
const PROMPT = `You are Concierge, the website assistant for ${COMPANY}. Visitors are potential customers.

Knowledge: call search_knowledge before answering any product question. Answer only from its results.
If it returns nothing, or nothing that answers the question, say you'll check with the team. Never guess.

Qualifying: when a visitor shows buying interest, find out their company, their name, how many seats and
their timeline, one short question at a time. Once you know all four, call create_lead exactly once,
then call notify_team with a two-line summary and the dealUrl.

Replies: at most 2 short sentences. Cards in the chat show the details, so don't repeat them.`;

export function createConciergeAgent() {
  return new BuiltInAgent({
    model: MODEL,
    prompt: PROMPT,
    maxSteps: 8,
    tools: [searchKnowledgeTool, createLeadTool, notifyTeamTool],
  });
}
