import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter, PageHeader, Section, Reveal } from "@/components/site/primitives";
import { SITE_CONTACT } from "@/lib/site-contact";

const CANONICAL = "https://qfloww.pridemarketing.co.in/contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Qfloww — Pride Marketing" },
      {
        name: "description",
        content:
          "Reach the Qfloww team by email, phone, or WhatsApp. Onboarding, support, billing, and partnership queries — one address, one number.",
      },
      { property: "og:title", content: "Contact Qfloww" },
      {
        property: "og:description",
        content:
          "Talk to the team behind Qfloww by email, phone, or WhatsApp.",
      },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: CANONICAL,
          mainEntity: {
            "@type": "Organization",
            name: SITE_CONTACT.legalEntity,
            url: SITE_CONTACT.parentUrl,
            email: SITE_CONTACT.email,
            telephone: SITE_CONTACT.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bhopal",
              addressRegion: "Madhya Pradesh",
              addressCountry: "IN",
            },
          },
        }),
      },
    ],
  }),
});

function ContactPage() {
  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: SITE_CONTACT.email,
      href: `mailto:${SITE_CONTACT.email}`,
      note: "Best for onboarding, billing, and detailed questions. We reply within one business day.",
      external: false,
    },
    {
      icon: Phone,
      label: "Phone",
      value: SITE_CONTACT.phone,
      href: `tel:${SITE_CONTACT.phoneTel}`,
      note: "Mon – Sat, 10:00 – 19:00 IST. Voice calls only.",
      external: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: SITE_CONTACT.phone,
      href: SITE_CONTACT.whatsapp,
      note: "Quickest way to reach us. Send a message and we'll pick it up.",
      external: true,
    },
  ];

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <PageHeader
          index="01"
          eyebrow="Contact"
          title={<>Three ways in.<br /> One team on the other side.</>}
          lede="Whether you're onboarding a business, sorting out billing, or asking whether Qfloww fits your front desk — pick the channel that suits you."
        />

        <Section>
          <div className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 100}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex h-full flex-col bg-paper p-8 transition-colors hover:bg-warm-1 lg:p-10"
                >
                  <div className="flex items-start justify-between">
                    <c.icon className="h-5 w-5 text-warm-4 transition-colors group-hover:text-ink" aria-hidden="true" />
                    <ArrowUpRight className="h-4 w-4 text-warm-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                  </div>
                  <p className="section-marker mt-8">{c.label}</p>
                  <p className="mt-3 font-display text-2xl tracking-tight">{c.value}</p>
                  <p className="mt-4 text-sm text-warm-5">{c.note}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="section-marker">02 — Studio</p>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={120}>
              <h2 className="font-display text-3xl leading-[1.1] tracking-[-0.02em] md:text-4xl">
                Built and run by {SITE_CONTACT.legalEntity}.
              </h2>
              <p className="mt-6 max-w-2xl text-warm-5">
                Qfloww is a product of {SITE_CONTACT.legalEntity}, a design and technology studio based in {SITE_CONTACT.jurisdiction}. We onboard a
                small list of businesses at a time so setup, slot configuration, and billing stay clean.
              </p>
              <div className="mt-8 flex items-start gap-3 text-sm text-warm-5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-warm-4" aria-hidden="true" />
                <p>{SITE_CONTACT.address}</p>
              </div>
              <a
                href={SITE_CONTACT.parentUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-all hover:bg-ink hover:text-paper hover:-translate-y-0.5"
              >
                Visit Pride Marketing <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
