import { defineTool } from "@copilotkit/runtime/v2";
import type { z } from "zod";
import { ambi } from "../ambiguous";
import { TOOL, notifyTeamParams, type NotifyTeamResult } from "../contracts";

const CHANNEL_NAME = process.env.CONCIERGE_SALES_CHANNEL ?? "sales";

type Channel = { id: string; name: string; type: string };
let channelId: string | undefined;

async function salesChannelId(): Promise<string> {
  if (channelId) return channelId;
  const { data } = await ambi<{ data: Channel[] }>("/api/channels");
  const channel = data.find((c) => c.name.replace(/^#/, "").toLowerCase() === CHANNEL_NAME.toLowerCase());
  if (!channel) {
    throw new Error(`No "#${CHANNEL_NAME}" channel visible to Concierge. Create it in Ambiguous Chat and add Concierge.`);
  }
  channelId = channel.id;
  return channelId;
}

export async function notifyTeam({ summary, dealUrl }: z.infer<typeof notifyTeamParams>): Promise<NotifyTeamResult> {
  const content = dealUrl ? `🔥 Hot lead\n${summary}\n${dealUrl}` : `🔥 Hot lead\n${summary}`;
  const message = await ambi<{ id: string }>(`/api/channels/${await salesChannelId()}/messages`, {
    method: "POST",
    json: { content },
  });
  return { messageId: message.id };
}

export const notifyTeamTool = defineTool({
  name: TOOL.notifyTeam,
  description:
    "Post a hot-lead alert to the sales team's chat channel. Call once, after create_lead, with a two-line summary " +
    "(company, seats, timeline, need) and the dealUrl from create_lead.",
  parameters: notifyTeamParams,
  execute: async (args) => notifyTeam(args),
});
