import { ConciergeWidget } from "@/components/concierge/ConciergeWidget";

// S1 placeholder. The Acme website sections replace this in a later stage.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-3xl font-semibold">Acme</h1>
      <p className="text-zinc-500">Placeholder page. Open the chat bubble bottom-right.</p>
      <ConciergeWidget />
    </main>
  );
}
