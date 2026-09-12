// Runs each server tool against the real Ambiguous workspace, without the chat.
//   npm run smoke            read-only: search_knowledge
//   npm run smoke -- --write also create_lead + notify_team ([SMOKE] records, one #sales message)
import { createLead } from "../lib/tools/create-lead";
import { notifyTeam } from "../lib/tools/notify-team";
import { searchKnowledge } from "../lib/tools/search-knowledge";

const write = process.argv.includes("--write");
let failed = 0;

async function check(name: string, input: string, run: () => Promise<string>) {
  const label = `${name.padEnd(17)} ${input.padEnd(30)}`;
  try {
    console.log(`${label} ok    ${await run()}`);
  } catch (error) {
    failed++;
    console.log(`${label} FAIL  ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  await check("search_knowledge", 'query="SAP"', async () => {
    const { results } = await searchKnowledge("SAP");
    if (results.length === 0) throw new Error("0 results: is there an Integrations page mentioning SAP in the Acme space?");
    return `${results.length} result(s): ${results.map((r) => r.title).join(", ")}`;
  });

  await check("search_knowledge", 'query="on-prem" (gap)', async () => {
    const { results } = await searchKnowledge("on-prem");
    if (results.length > 0) throw new Error(`expected 0, got: ${results.map((r) => r.title).join(", ")}`);
    return "0 results, gap as intended";
  });

  if (!write) {
    console.log("\nread-only run. Add --write to also test create_lead and notify_team.");
  } else {
    let dealUrl: string | undefined;
    await check("create_lead", 'company="[SMOKE] Northline"', async () => {
      const lead = await createLead(
        { company: "Northline Freight", contactName: "Jane Doe", seats: 200, timeline: "Q4", need: "SAP integration" },
        "[SMOKE] ",
      );
      dealUrl = lead.dealUrl;
      return `contact ${lead.contactId.slice(0, 8)}, deal ${lead.dealId.slice(0, 8)}, ${lead.dealUrl}`;
    });

    await check("notify_team", 'summary="smoke test"', async () => {
      const { messageId } = await notifyTeam({ summary: "[SMOKE] test message from scripts/smoke-tools.ts", dealUrl });
      return `message ${messageId.slice(0, 8)} posted`;
    });
  }

  console.log(failed === 0 ? "\nall checks passed" : `\n${failed} check(s) failed`);
  process.exitCode = failed === 0 ? 0 : 1;
}

void main();
