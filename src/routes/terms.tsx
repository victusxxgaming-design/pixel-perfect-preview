import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHero } from "@/components/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms and Conditions", "By purchasing you agree to use products for personal use. This is placeholder legal text."),
  component: () => (
    <Shell>
      <PageHero eyebrow="Terms" title="Terms and Conditions" sub="By purchasing you agree to use products for personal use. This is placeholder legal text." />
    </Shell>
  ),
});
