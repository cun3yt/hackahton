import { defineTool } from "@copilotkit/runtime/v2";
import type { z } from "zod";
import { AMBI_URL, ambi } from "../ambiguous";
import { TOOL, createLeadParams, type CreateLeadResult } from "../contracts";

type Contact = { id: string };
type Deal = { id: string };

export async function createLead(args: z.infer<typeof createLeadParams>, titlePrefix = ""): Promise<CreateLeadResult> {
  const { company, contactName, email, seats, timeline, need } = args;

  const { contact: companyContact } = await ambi<{ contact: Contact }>("/api/crm/contacts", {
    method: "POST",
    json: { type: "company", name: `${titlePrefix}${company}` },
  });
  const { contact: person } = await ambi<{ contact: Contact }>("/api/crm/contacts", {
    method: "POST",
    json: { type: "person", name: contactName, email: email ?? null, company_id: companyContact.id },
  });
  const { deal } = await ambi<{ deal: Deal }>("/api/crm/deals", {
    method: "POST",
    json: {
      title: `${titlePrefix}${company}: ${seats} seats, live by ${timeline}, ${need}`,
      contact_id: person.id,
      company_id: companyContact.id,
      status: "open",
    },
  });

  return {
    contactId: person.id,
    dealId: deal.id,
    company,
    seats,
    timeline,
    need,
    dealUrl: `${AMBI_URL}/crm/deals/${deal.id}`, // unverified route; checked at the S4 checkpoint
  };
}

export const createLeadTool = defineTool({
  name: TOOL.createLead,
  description:
    "Create the visitor's company, contact and an open deal in the CRM. " +
    "Call exactly once per visitor, only after you know company, contact name, seats and timeline.",
  parameters: createLeadParams,
  execute: async (args) => createLead(args),
});
