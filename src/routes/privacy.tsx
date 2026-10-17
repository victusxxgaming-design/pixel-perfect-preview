import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHero } from "@/components/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "We collect only what's needed to deliver your order. Placeholder legal text."),
  component: () => (
    <Shell>
      <PageHero eyebrow="Privacy" title="Privacy Policy" sub="We collect only what's needed to deliver your order. Placeholder legal text." />
    </Shell>
  ),
});
