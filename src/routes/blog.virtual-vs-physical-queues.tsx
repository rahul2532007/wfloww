import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, PageHeader, Section, CTASection } from "@/components/site/primitives";

const CANONICAL = "https://qfloww.pridemarketing.co.in/blog/virtual-vs-physical-queues";

export const Route = createFileRoute("/blog/virtual-vs-physical-queues")({
  component: BlogPost,
  head: () => ({
    meta: [
      { title: "Virtual Queues vs Physical Waiting Rooms — Qfloww" },
      {
        name: "description",
        content:
          "Compare virtual queue management systems with traditional physical waiting rooms. See how predictable arrivals, no-show reduction, and slot capacity change how clinics, salons, and consulting firms run their day.",
      },
      { property: "og:title", content: "Virtual Queues vs Physical Waiting Rooms" },
      {
        property: "og:description",
        content:
          "Physical lines waste hours and floor space. Virtual queues turn arrivals into a predictable schedule. Here's how the two compare — and what to switch first.",
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
          headline: "Virtual Queues vs Physical Waiting Rooms",
          about: "Queue management system comparison — virtual queue vs physical waiting room",
          author: { "@type": "Organization", name: "Qfloww" },
          mainEntityOfPage: CANONICAL,
        }),
      },
    ],
  }),
});

function BlogPost() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <PageHeader
          index="B1"
          eyebrow="Blog · 5 min read"
          title={<>Virtual queues vs<br /> physical waiting rooms.</>}
          lede="Physical waiting rooms convert floor space into idle time. A virtual queue management system converts the same demand into a predictable schedule — and gives clients back their morning."
        />

        <Section>
          <article className="mx-auto grid max-w-4xl gap-10">
            <div className="space-y-4">
              <p className="section-marker">01 — The problem with the physical line</p>
              <h2 className="font-display text-3xl tracking-[-0.02em]">Physical queues optimise for the venue, not the client.</h2>
              <p className="text-warm-5">
                A physical waiting room asks every client to arrive early, sit down, and outlast the people ahead of them. The
                venue absorbs the uncertainty — chairs, floor space, front-desk attention, air conditioning — and the client
                absorbs the wait. It only looks efficient because the cost is hidden inside somebody else's calendar.
              </p>
              <p className="text-warm-5">
                Peaks are the worst of it. When ten people show up in the same fifteen minutes, the room fills; the ninth person
                waits an hour for a five-minute service. Nobody planned it, and there's no way to smooth it out after the fact.
              </p>
            </div>

            <div className="space-y-4">
              <p className="section-marker">02 — What a virtual queue changes</p>
              <h2 className="font-display text-3xl tracking-[-0.02em]">Virtual queues optimise for arrival capacity.</h2>
              <p className="text-warm-5">
                A virtual queue management system publishes your day as discrete slots — morning, afternoon, evening — with a cap
                per slot. Clients book a token online, receive it by SMS or email, and only walk in when their number is close.
                The waiting happens at home, on their phone, and the front desk sees a steady trickle instead of a wave.
              </p>
              <ul className="ml-4 list-disc space-y-2 text-warm-5">
                <li>Arrivals become predictable — you know how many tokens are already sold before the day starts.</li>
                <li>Floor space stops being the bottleneck; you can run out of a smaller room without turning people away.</li>
                <li>No-shows drop because the token itself is a commitment: clients picked the slot, not you.</li>
                <li>Staff plan breaks around real gaps in the schedule instead of hoping for a quiet moment.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="section-marker">03 — Head to head</p>
              <div className="overflow-hidden border border-rule">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rule bg-warm-1">
                      <th className="px-4 py-3 text-left font-medium">Dimension</th>
                      <th className="px-4 py-3 text-left font-medium">Physical waiting room</th>
                      <th className="px-4 py-3 text-left font-medium">Virtual queue</th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr]:border-b [&>tr]:border-rule">
                    <tr><td className="px-4 py-3">Where clients wait</td><td className="px-4 py-3 text-warm-5">On your chairs</td><td className="px-4 py-3">On their phone, anywhere</td></tr>
                    <tr><td className="px-4 py-3">Arrival control</td><td className="px-4 py-3 text-warm-5">First-come, first-served chaos</td><td className="px-4 py-3">Slot-based capacity caps</td></tr>
                    <tr><td className="px-4 py-3">Peak handling</td><td className="px-4 py-3 text-warm-5">Overflow, standing room</td><td className="px-4 py-3">Slot fills, next slot offered</td></tr>
                    <tr><td className="px-4 py-3">No-shows</td><td className="px-4 py-3 text-warm-5">Common, invisible</td><td className="px-4 py-3">Tracked, reduced by commitment</td></tr>
                    <tr><td className="px-4 py-3">Setup cost</td><td className="px-4 py-3 text-warm-5">Rent, chairs, coffee, staff</td><td className="px-4 py-3">A booking link on your phone</td></tr>
                    <tr><td className="px-4 py-3">Client experience</td><td className="px-4 py-3 text-warm-5">Sit and wait</td><td className="px-4 py-3">Arrive and get seen</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <p className="section-marker">04 — When physical still wins</p>
              <h2 className="font-display text-3xl tracking-[-0.02em]">A waiting room isn't always wrong.</h2>
              <p className="text-warm-5">
                Walk-in emergencies, pharmacies, and services that genuinely can't be scheduled still need a physical queue —
                the friction of booking would turn people away. Even then, a virtual queue works alongside the room: walk-ins
                get a token, sit down if they want, and the screen tells them when to move.
              </p>
            </div>

            <div className="space-y-4">
              <p className="section-marker">05 — What to switch first</p>
              <h2 className="font-display text-3xl tracking-[-0.02em]">Start with the busiest hour, not the whole day.</h2>
              <p className="text-warm-5">
                Pick the single slot that overflows most often — the Saturday morning at the salon, the 6pm consult at the
                clinic — and cap it. Publish the booking link. Everyone else keeps walking in the way they always have. Once
                the peak calms down, extend the caps to the rest of the day.
              </p>
              <p className="text-warm-5">
                A queue management system pays for itself the first weekend the room doesn't overflow. See our{" "}
                <Link to="/virtual-queue-guide" className="underline underline-offset-4 hover:text-ink">virtual queue guide</Link>{" "}
                for the mechanics of slots, tokens, and rollout.
              </p>
            </div>
          </article>
        </Section>

        <CTASection title={<>Replace your waiting room<br /> with a queue that respects time.</>} />
      </main>
      <SiteFooter />
    </div>
  );
}
