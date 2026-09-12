import { ConciergeWidget } from "@/components/concierge/ConciergeWidget";
import { Faq } from "@/components/site/Faq";
import { Hero } from "@/components/site/Hero";
import { Integrations } from "@/components/site/Integrations";
import { Nav } from "@/components/site/Nav";
import { Pricing } from "@/components/site/Pricing";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <Pricing />
        <Faq />
      </main>
      <ConciergeWidget />
    </>
  );
}
