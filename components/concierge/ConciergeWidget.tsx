"use client";

import { CopilotPopup, ToolCallStatus, useHumanInTheLoop, useRenderTool } from "@copilotkit/react-core/v2";
import {
  TOOL,
  bookMeetingParams,
  captureEmailParams,
  chooseSlotParams,
  createLeadParams,
  searchKnowledgeParams,
  type BookMeetingResult,
  type CaptureEmailResult,
  type ChooseSlotResult,
  type CreateLeadResult,
  type LogGapResult,
  type SearchKnowledgeResult,
  getSlotsParams,
  logGapParams,
} from "@/lib/contracts";
import { BookedCard, BookedCardLoading } from "./cards/BookedCard";
import { EmailCapture, EmailCaptured } from "./cards/EmailCapture";
import { GapCard, GapCardLoading } from "./cards/GapCard";
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

  // Knowledge gap (Flow E): ask where to send the answer, then show that the team got the question.
  useHumanInTheLoop(
    {
      name: TOOL.captureEmail,
      description:
        "Ask the visitor for an email so the team can send the answer to a question the Wiki could not answer. " +
        "Returns { email } or { declined: true }.",
      parameters: captureEmailParams,
      render: ({ status, args, respond, result }) => {
        if (status === ToolCallStatus.Executing) return <EmailCapture question={args.question} onSubmit={(value) => void respond(value)} />;
        if (status === ToolCallStatus.Complete) return <EmailCaptured result={parseResult<CaptureEmailResult>(result)} />;
        return null;
      },
    },
    [],
  );

  useRenderTool(
    {
      name: TOOL.logGap,
      parameters: logGapParams,
      render: ({ status, result }) => {
        if (status !== "complete") return <GapCardLoading />;
        const parsed = parseResult<LogGapResult>(result);
        return parsed ? <GapCard result={parsed} /> : null;
      },
    },
    [],
  );

  // notify_team has no card on purpose: the alert shows up in Ambiguous #sales (right screen).

  return (
    <CopilotPopup labels={LABELS} />
  );
}
