"use client";

import { CopilotPopup, useRenderTool } from "@copilotkit/react-core/v2";
import {
  TOOL,
  createLeadParams,
  searchKnowledgeParams,
  type CreateLeadResult,
  type SearchKnowledgeResult,
} from "@/lib/contracts";
import { LeadCard, LeadCardLoading } from "./cards/LeadCard";
import { parseResult } from "./cards/parse";
import { SourceCard, SourceCardLoading } from "./cards/SourceCard";

// Module-level constant: a new labels object on every render would re-trigger the chat configuration.
const LABELS = {
  modalHeaderTitle: "Acme assistant",
  welcomeMessageText: "Hi! Ask me about Acme: integrations, pricing or getting your fleet set up.",
  chatInputPlaceholder: "Ask about Acme…",
};

export function ConciergeWidget() {
  useRenderTool(
    {
      name: TOOL.searchKnowledge,
      parameters: searchKnowledgeParams,
      render: ({ status, parameters, result }) => {
        if (status !== "complete") return <SourceCardLoading query={parameters.query} />;
        const parsed = parseResult<SearchKnowledgeResult>(result);
        return parsed ? <SourceCard result={parsed} /> : null;
      },
    },
    [],
  );

  useRenderTool(
    {
      name: TOOL.createLead,
      parameters: createLeadParams,
      render: ({ status, parameters, result }) => {
        if (status !== "complete") return <LeadCardLoading company={parameters.company} />;
        const parsed = parseResult<CreateLeadResult>(result);
        return parsed ? <LeadCard result={parsed} /> : null;
      },
    },
    [],
  );

  // notify_team has no card on purpose: the alert shows up in Ambiguous #sales (right screen).

  return (
    <CopilotPopup labels={LABELS} />
  );
}
