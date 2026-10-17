import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHero } from "@/components/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("We're here to help", "Email support@vantix.example or join our Discord. Average reply time: 2 hours."),
  component: () => (
    <Shell>
      <PageHero eyebrow="Contact & Support" title="We're here to help" sub="Email support@vantix.example or join our Discord. Average reply time: 2 hours." />
    </Shell>
  ),
});
