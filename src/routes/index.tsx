import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  BellRing,
  ShieldCheck,
  Sparkles,
  Building2,
  Scissors,
  Stethoscope,
  Briefcase,
  Phone,
} from "lucide-react";
import {
  SiteHeader,
  SiteFooter,
  Section,
  SectionHeader,
  CTASection,
  Wordmark,
  Reveal,
  RevealGroup,
} from "@/components/site/primitives";
import { SITE_CONTACT } from "@/lib/site-contact";

const CANONICAL = "https://qfloww.pridemarketing.co.in/";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Qfloww — Editorial booking & queue management" },
      {
        name: "description",
        content:
          "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios.",
      },
      { property: "og:title", content: "Qfloww — Editorial booking & queue management" },
      {
        property: "og:description",
        content:
          "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios.",
      },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Do clients need an account?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. The public booking page takes a name and a phone number — that's the whole flow.",
              },
            },
            {
              "@type": "Question",
              name: "Can I sign up my business directly?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Create an account at /signup, confirm your email, and your booking page goes live after activation. Manual concierge onboarding is available if you prefer.",
              },
            },
            {
              "@type": "Question",
              name: "Do you send booking confirmations?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Clients who share an email get a branded confirmation with their token, slot, and date. Your team sees the same booking live on the panel.",
              },
            },
            {
              "@type": "Question",
              name: "What happens if a plan expires?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You get a soft warning strip first, a grace period next, and only then a locked owner view. The public booking page stays polite either way.",
              },
            },
            {
              "@type": "Question",
              name: "Who can staff the front desk?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Two staff roles: reception (check-ins and queue) and management (owner view with billing and history). Platform admin is handled by Pride Marketing.",
              },
            },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Numbers />
        <Process />
        <Industries />
        <Quote />
        <Features />
        <FAQ />
      </main>
      <CTASection
        eyebrow="09 — GET STARTED"
        title={
          <>
            Ready to run a<br className="hidden sm:block" /> calmer front desk?
          </>
        }
        ctaLabel="Book a consultation"
      />
      <SiteFooter />
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-10 lg:pt-24 lg:pb-28">
        <Reveal>
          <p className="section-marker">Qfloww — EST. STUDIO, GLOBAL</p>
        </Reveal>
        <Reveal delay={80} y={24}>
          <h1
            className="mt-8 font-display font-medium leading-[1.02] tracking-[-0.03em] [text-wrap:balance]"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)" }}
          >
            Your bookings should be{" "}
            your <span className="font-serif italic font-normal text-amber">best receptionist</span>
            <span className="text-ink">.</span>
          </h1>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-8 max-w-2xl text-base text-warm-5 sm:text-lg">
            We run branded booking pages and a calm front-desk queue for ambitious teams —
            built around the decisions your clients actually make.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:opacity-90 hover:-translate-y-0.5"
            >
              Create your booking page <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Book a consultation
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        {/* Editorial receipt-style "spec card" */}
        <div className="mt-20 border-t border-rule pt-8">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <RevealGroup stagger={90} initialDelay={80}>
              {[
                <SpecItem key="1" label="Interface" value="01" note="One panel, one account — easy to train" />,
                <SpecItem key="2" label="Onboarding" value="Same day" note="Self-signup or concierge" />,
                <SpecItem key="3" label="Client accounts" value="0" note="Name + phone, done" />,
                <SpecItem key="4" label="Confirmations" value="Email" note="Branded, transactional" />,
              ]}
            </RevealGroup>
          </dl>
        </div>
      </div>
    </section>
  );
}

function SpecItem({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <p className="section-marker">{label}</p>
      <p className="mt-2 font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-xs text-warm-4">{note}</p>
    </div>
  );
}

/* ─── Marquee strip: business types ────────────────────────── */
function Marquee() {
  const items = ["Dental Clinics", "Salons", "Consulting Studios", "Aesthetic Bars", "Physio Practices", "Legal Chambers", "Dermatology", "Wellness"];
  return (
    <section className="border-t border-rule bg-warm-1 py-8">
      <div className="overflow-hidden">
        <div className="geo-marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl text-warm-4">
          {[...items, ...items].map((t, i) => (
            <span key={`${t}-${i}`} className="flex items-center gap-12">
              {t}
              <span aria-hidden="true" className="text-warm-3">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─────────────────────────────────────────────── */
function Services() {
  const cards = [
    {
      n: "A",
      title: "Public booking page",
      copy: "Clients pick a slot on a branded /book/your-name URL, drop a name and phone, and get a token — no account, no friction.",
      icon: CalendarClock,
    },
    {
      n: "B",
      title: "Live front-desk queue",
      copy: "The receptionist advances arrivals, ongoing and completed tokens in real time. Walk-ins take one line of typing.",
      icon: ClipboardList,
    },
    {
      n: "C",
      title: "Owner view",
      copy: "Same day, quieter angle. Billing status, plan expiry banners, completion toasts — the details you actually want to see.",
      icon: BellRing,
    },
    {
      n: "D",
      title: "Admin control room",
      copy: "We onboard the business, wire up slots and services, and keep billing state clean. You never touch a settings page.",
      icon: ShieldCheck,
    },
  ];
  return (
    <Section id="services">
      <SectionHeader
        index="01"
        eyebrow="Services"
        title={<>Four small surfaces,<br /> one calm workflow.</>}
        lede="No dashboards to babysit. Each surface does one job well and hands off to the next without fanfare."
      />
      <div className="mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 90}>
            <div className="group h-full bg-paper p-8 transition-colors hover:bg-warm-1 lg:p-10">
              <div className="flex items-start justify-between">
                <span className="section-marker">— {c.n}</span>
                <c.icon className="h-5 w-5 text-warm-4 transition-colors group-hover:text-ink" aria-hidden="true" />
              </div>
              <h3 className="mt-8 font-display text-2xl tracking-tight">{c.title}</h3>
              <p className="mt-3 max-w-md text-sm text-warm-5">{c.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Numbers ──────────────────────────────────────────────── */
function Numbers() {
  const stats = [
    { k: "01", v: "≤ 45s", label: "Average booking time on the public page" },
    { k: "02", v: "1", label: "Single panel, single account — nothing to switch between" },
    { k: "03", v: "0", label: "Client accounts to remember" },
    { k: "04", v: "24/7", label: "Booking page available, always" },
  ];
  return (
    <Section>
      <SectionHeader
        index="02"
        eyebrow="By the numbers"
        title={<>A small footprint,<br /> measured in seconds.</>}
        lede="We treat every extra tap as a design failure. These are the numbers we chase."
      />
      <div className="mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 90}>
            <div className="h-full bg-paper p-8">
              <p className="section-marker">{s.k}</p>
              <p className="mt-6 font-display text-5xl leading-none tracking-[-0.02em] md:text-6xl">{s.v}</p>
              <p className="mt-4 text-sm text-warm-5">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Process ──────────────────────────────────────────────── */
function Process() {
  const steps = [
    { n: "01", title: "Create your account", body: "Sign up at /signup, choose your business slug, and confirm your email. Takes under two minutes." },
    { n: "02", title: "Activation", body: "We review and activate your business, seed slots and services with you, and hand over reception + owner logins." },
    { n: "03", title: "Soft launch", body: "Your /book/your-name URL goes live. Clients book; email confirmations go out automatically. We watch the first week with you." },
    { n: "04", title: "Steady state", body: "Trial → monthly or yearly plan. Warning → grace → lock states run quietly. No surprise invoices." },
  ];
  return (
    <Section>
      <SectionHeader
        index="03"
        eyebrow="Process"
        title={<>Self-signup, with a<br /> concierge on standby.</>}
        lede="Sign up on your own or ask us to onboard you. Either way, one point of contact, no self-serve settings to break."
      />
      <ol className="mt-16 divide-y divide-rule border-y border-rule">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 80} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-2">
              <p className="font-display text-4xl leading-none tracking-[-0.02em] text-warm-3">{s.n}</p>
            </div>
            <div className="lg:col-span-4">
              <h3 className="font-display text-2xl tracking-tight">{s.title}</h3>
            </div>
            <div className="lg:col-span-6">
              <p className="max-w-xl text-warm-5">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ─── Industries ───────────────────────────────────────────── */
function Industries() {
  const rows = [
    { icon: Stethoscope, name: "Clinics & Dental", note: "Multi-doctor slots, walk-ins, no-show flow." },
    { icon: Scissors, name: "Salons & Studios", note: "Chair-level tokens, back-to-back rebooking." },
    { icon: Briefcase, name: "Consulting", note: "Named-hour blocks, private client fields." },
    { icon: Building2, name: "Multi-location", note: "One admin, several branded booking pages." },
  ];
  return (
    <Section>
      <SectionHeader
        index="04"
        eyebrow="Industries"
        title={<>Built for the businesses<br /> that run on a queue.</>}
        lede="If your calendar is really a token line with a polite name, you're the audience."
      />
      <div className="mt-16 divide-y divide-rule border-y border-rule">
        {rows.map((r, i) => (
          <Reveal key={r.name} delay={i * 70}>
            <div className="group grid items-center gap-6 py-8 lg:grid-cols-12 transition-colors hover:bg-warm-1">
              <div className="lg:col-span-1">
                <r.icon className="h-5 w-5 text-warm-4 transition-colors group-hover:text-ink" aria-hidden="true" />
              </div>
              <div className="lg:col-span-4">
                <p className="font-display text-xl">{r.name}</p>
              </div>
              <div className="lg:col-span-6">
                <p className="text-warm-5">{r.note}</p>
              </div>
              <div className="lg:col-span-1 lg:text-right">
                <ArrowUpRight className="ml-auto h-4 w-4 text-warm-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Pull quote ───────────────────────────────────────────── */
function Quote() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="section-marker">05 — In practice</p>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={120}>
          <blockquote className="font-serif text-3xl leading-[1.15] tracking-[-0.01em] md:text-4xl lg:text-5xl">
            "It replaced our phone, our diary, and the sticky-note stack next to the till.
            We still don't know what plan we're on, and that's exactly the point."
          </blockquote>
          <p className="mt-8 text-sm text-warm-4">— Front desk lead, dermatology practice</p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─── Features grid ────────────────────────────────────────── */
function Features() {
  const items = [
    { title: "Token line by slot", body: "Each slot gets its own numbered line. No shared counters, no confusion at 6pm." },
    { title: "Walk-ins in one line", body: "Type a name, hit enter, hand out a token. That's the whole ceremony." },
    { title: "Live queue for staff", body: "Everyone shares the same real-time view: booked, arrived, ongoing, completed, no-show." },
    { title: "Email confirmations", body: "Clients who share an email get a branded confirmation with token, date, and slot — sent through a durable queue." },
    { title: "One account, one panel", body: "No role-switching, no separate logins. Sign in once and run the desk end-to-end." },
    { title: "Plan states, not popups", body: "Trial, monthly, yearly. Warning → grace → lock — a thin colored strip, never a modal." },
    { title: "Branded booking URL", body: "/book/your-name. Yours to print on cards, add to bio links, paste into WhatsApp." },
    { title: "No client accounts", body: "Clients type a name and phone. That's it. Nothing to remember." },
    { title: "Service-level slots", body: "Configure services per business (clinic, salon, consulting) and cap capacity per slot." },
  ];
  return (
    <Section>
      <SectionHeader
        index="06"
        eyebrow="Features"
        title={<>Small decisions,<br /> stacked with intent.</>}
      />
      <div className="mt-16 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 90}>
            <div className="group h-full bg-paper p-8 transition-colors hover:bg-warm-1">
              <Sparkles className="h-4 w-4 text-warm-3 transition-colors group-hover:text-amber" aria-hidden="true" />
              <h3 className="mt-6 font-display text-xl tracking-tight">{f.title}</h3>
              <p className="mt-3 text-sm text-warm-5">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
function FAQ() {
  const qs = [
    { q: "Do clients need an account?", a: "No. The public booking page takes a name and a phone number — email is optional and unlocks a branded confirmation." },
    { q: "Can I sign up my business directly?", a: "Yes. Create an account at /signup, confirm your email, and your business waits on a short activation step. Prefer concierge onboarding? Email or WhatsApp us." },
    { q: "Do you send booking confirmations?", a: "Yes. Every booking with an email address gets a branded transactional email with the token, slot time, and date." },
    { q: "What happens if a plan expires?", a: "You get a soft warning strip first, a grace period next, and only then a locked owner view. The public booking page stays polite either way." },
    { q: "Who staffs the day?", a: "Two roles: reception (check-ins, walk-ins, queue advancement) and management (owner view, history, billing state). Platform admin is handled by Pride Marketing." },
    { q: "Which businesses is Qfloww for?", a: "Clinics and dental practices, salons and studios, and consulting firms — any appointment-driven business that runs on a token line." },
  ];
  return (
    <Section>
      <SectionHeader
        index="07"
        eyebrow="FAQ"
        title={<>The questions we<br /> hear the most.</>}
      />
      <div className="mt-16 divide-y divide-rule border-y border-rule">
        {qs.map((it, i) => (
          <Reveal key={it.q} delay={i * 60}>
            <details className="group py-8" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="font-display text-xl tracking-tight md:text-2xl">{it.q}</span>
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-rule text-warm-4 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-warm-5 animate-fade-in">{it.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-rule bg-warm-1 p-8">
          <div>
            <p className="section-marker">08 — Still on the fence?</p>
            <p className="mt-3 font-display text-2xl">
              Talk to <Wordmark />
            </p>
          </div>
          <a
            href={`tel:${SITE_CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-5 py-2.5 text-sm text-ink transition-all hover:bg-ink hover:text-paper hover:-translate-y-0.5"
          >
            <Phone className="h-4 w-4" aria-hidden="true" /> {SITE_CONTACT.phone}
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
