import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter, PageHeader, Section, CTASection } from "@/components/site/primitives";

const CANONICAL = "https://qfloww.pridemarketing.co.in/virtual-queue-guide";

export const Route = createFileRoute("/virtual-queue-guide")({
  component: GuidePage,
  head: () => ({
    meta: [
      { title: "Virtual Queue Management System Guide — Qfloww" },
      {
        name: "description",
        content:
          "How virtual queue management systems work and how clinics, salons, and consulting firms use them to replace physical waiting rooms with slot-based online booking.",
      },
      { property: "og:title", content: "Virtual Queue Management System Guide" },
      {
        property: "og:description",
        content:
          "A practical guide to virtual queues: how they work, why waiting rooms are shrinking, and how small businesses roll one out in a week.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Virtual Queue Management System Guide",
          about: "Virtual queue management system for clinics, salons, and consulting firms",
          author: { "@type": "Organization", name: "Qfloww" },
          mainEntityOfPage: CANONICAL,
        }),
      },
    ],
  }),
});

function GuidePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <PageHeader
          index="G1"
          eyebrow="Guide · 6 min read"
          title={<>Virtual queue systems,<br /> plainly explained.</>}
          lede="Waiting rooms used to be a design constraint. A virtual queue moves the wait onto the client's phone — your front desk only sees people ready to be served."
        />

        <Section>
          <article className="grid gap-8 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <p className="section-marker">Contents</p>
              <ul className="mt-4 space-y-2 text-sm text-warm-5">
                <li><a href="#what" className="hover:text-ink">What it is</a></li>
                <li><a href="#how" className="hover:text-ink">How it works</a></li>
                <li><a href="#why" className="hover:text-ink">Why businesses switch</a></li>
                <li><a href="#fit" className="hover:text-ink">Who it fits</a></li>
                <li><a href="#rollout" className="hover:text-ink">Rolling it out in a week</a></li>
              </ul>
            </aside>

            <div className="space-y-16 lg:col-span-8">
              <Block id="what" n="01" title="What is a virtual queue system?">
                A virtual queue management system replaces a physical line, a paper token roll, or a chalkboard with software. Clients pick a time slot from a public booking page, receive a token number, and get called in when it's their turn — without standing in a waiting area.
              </Block>

              <Block id="how" n="02" title="How the queue works">
                <ol className="mt-2 list-decimal space-y-3 pl-5 text-warm-5">
                  <li>The business publishes slots — 9:00, 11:00, 14:00 — each with a capacity.</li>
                  <li>Clients open a branded booking page, pick a date and slot, and get a token number.</li>
                  <li>At the front desk, reception marks arrivals, moves the current client from <em>arrived</em> to <em>ongoing</em> to <em>completed</em>, and adds walk-ins as new tokens.</li>
                  <li>The owner sees the same day from a quieter angle — live counts and any no-shows auto-flipped overnight.</li>
                </ol>
              </Block>

              <Block id="why" n="03" title="Why businesses switch">
                <div className="mt-4 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
                  {[
                    { t: "Predictable arrivals", b: "Slots cap how many clients can be present at the same time." },
                    { t: "Walk-ins in the same line", b: "Walk-ins still get tokens — inside the same queue as booked clients." },
                    { t: "Less phone friction", b: "Clients self-serve on their own time; the desk stops copying names from voicemails." },
                    { t: "Grounded wait times", b: "Estimates come from what actually happened today, not from guesses." },
                  ].map((c) => (
                    <div key={c.t} className="bg-paper p-6">
                      <p className="font-display text-lg">{c.t}</p>
                      <p className="mt-2 text-sm text-warm-5">{c.b}</p>
                    </div>
                  ))}
                </div>
              </Block>

              <Block id="fit" n="04" title="Who it fits (and who it doesn't)">
                Qfloww is built for small, appointment-driven service businesses — dental and eye clinics, salons, physiotherapy practices, tax consultants, immigration advisors. It's not built for high-volume retail counters or ticketed events; those need different tooling.
              </Block>

              <Block id="rollout" n="05" title="Rolling it out in a week">
                <ul className="mt-2 list-disc space-y-3 pl-5 text-warm-5">
                  <li>Day 1 — define slots, capacities, and services.</li>
                  <li>Day 2 — share the public booking link with your existing clients.</li>
                  <li>Day 3-5 — the front desk works both channels (phone + queue) until phone volume drops naturally.</li>
                  <li>Day 6-7 — publish the link on Google Business Profile and social; monitor no-show rates.</li>
                </ul>
              </Block>

              <div className="border-t border-rule pt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Back to home <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </Section>
      </main>

      <CTASection
        eyebrow="G9 — READY?"
        title={<>Let's set up your booking page this week.</>}
        ctaLabel="Talk to Pride"
      />
      <SiteFooter />
    </div>
  );
}

function Block({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <p className="section-marker">{n} — Section</p>
      <h2 className="mt-3 font-display text-3xl leading-[1.1] tracking-[-0.02em] md:text-4xl">
        {title}
      </h2>
      <div className="mt-4 text-warm-5">{children}</div>
    </section>
  );
}
