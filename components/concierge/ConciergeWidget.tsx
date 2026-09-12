"use client";

import { CopilotPopup, ToolCallStatus, useHumanInTheLoop, useRenderTool } from "@copilotkit/react-core/v2";
import {
  TOOL,
  bookMeetingParams,
  chooseSlotParams,
  createLeadParams,
  searchKnowledgeParams,
  type BookMeetingResult,
  type ChooseSlotResult,
  type CreateLeadResult,
  type SearchKnowledgeResult,
  getSlotsParams,
} from "@/lib/contracts";
import { BookedCard, BookedCardLoading } from "./cards/BookedCard";
import { LeadCard, LeadCardLoading } from "./cards/LeadCard";
import { parseResult } from "./cards/parse";
import { SlotPicked, SlotPicker, SlotPickerLoading } from "./cards/SlotPicker";
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

  useRenderTool(
    {
      name: TOOL.getSlots,
      parameters: getSlotsParams,
      render: ({ status }) => (status === "complete" ? null : <SlotPickerLoading />), // slots show in choose_slot
    },
    [],
  );

  // Human in the loop: the agent pauses until the visitor picks a slot (or declines).
  useHumanInTheLoop(
    {
      name: TOOL.chooseSlot,
      description:
        "Show the slots from get_slots as buttons and wait for the visitor to pick one. " +
        "Returns { start } or { declined: true }.",
      parameters: chooseSlotParams,
      render: ({ status, args, respond, result }) => {
        const slots = args.slots ?? [];
        if (status === ToolCallStatus.InProgress) return <SlotPickerLoading />;
        if (status === ToolCallStatus.Executing) return <SlotPicker slots={slots} onPick={(picked) => void respond(picked)} />;
        return <SlotPicked slots={slots} result={parseResult<ChooseSlotResult>(result)} />;
      },
    },
    [],
  );

  useRenderTool(
    {
      name: TOOL.bookMeeting,
      parameters: bookMeetingParams,
      render: ({ status, result }) => {
        if (status !== "complete") return <BookedCardLoading />;
        const parsed = parseResult<BookMeetingResult>(result);
        return parsed ? <BookedCard result={parsed} /> : null;
      },
    },
    [],
  );

  // notify_team has no card on purpose: the alert shows up in Ambiguous #sales (right screen).

  return (
    <CopilotPopup labels={LABELS} />
  );
}
