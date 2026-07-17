import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";
import { Reveal } from "./Reveal";
export { Reveal, RevealGroup } from "./Reveal";

/* ─────────────────────────────────────────────────────────────
 * Wordmark: Qfloww. — amber dot is the sole ornament.
 * ────────────────────────────────────────────────────────── */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      Qfloww<span className="brand-dot">.</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Section — standard container + generous vertical padding.
 * ────────────────────────────────────────────────────────── */
export function Section({
  id,
  children,
  className = "",
  bordered = true,
  as: As = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  as?: "section" | "div";
}) {
  return (
    <As
      id={id}
      className={`${bordered ? "border-t border-rule" : ""} py-24 lg:py-32 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">{children}</div>
    </As>
  );
}

/* ─────────────────────────────────────────────────────────────
 * SectionHeader — 4/8 editorial split: numbered eyebrow + big
 * headline + lede.
 * ────────────────────────────────────────────────────────── */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <p className="section-marker">
          {index} — {eyebrow}
        </p>
      </Reveal>
      <Reveal className="lg:col-span-8" delay={100}>
        <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          {title}
        </h2>
        {lede && (
          <p className="mt-6 max-w-2xl text-lg text-warm-5">{lede}</p>
        )}
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * PageHeader — top-of-route header with a bottom rule.
 * ────────────────────────────────────────────────────────── */
export function PageHeader({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHeader index={index} eyebrow={eyebrow} title={title} lede={lede} />
      </div>
    </header>
  );
}

export function RuleDivider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-rule ${className}`} />;
}

/* ─────────────────────────────────────────────────────────────
 * SiteHeader — sticky, paper/85 + blur, thin bottom rule.
 * ────────────────────────────────────────────────────────── */
const NAV_LINKS: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/virtual-queue-guide", label: "Guide" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="text-lg">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-warm-5 transition-colors hover:text-ink"
              activeProps={{ className: "text-sm text-ink" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 rounded-full border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Login <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-rule bg-paper md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-warm-5 hover:bg-warm-1 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-rule pt-3">
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-warm-5 hover:bg-warm-1 hover:text-ink"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
              >
                Login <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
 * CTASection — full-bleed dark band.
 * ────────────────────────────────────────────────────────── */
export function CTASection({
  eyebrow = "05 — GET STARTED",
  title,
  ctaLabel = "Talk to us",
  ctaHref = `mailto:${SITE_CONTACT.email}`,
}: {
  eyebrow?: string;
  title: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="dark border-t border-rule bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-32">
        <Reveal className="lg:col-span-4">
          <p className="section-marker">{eyebrow}</p>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={120}>
          <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <div className="mt-10">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-all hover:opacity-90 hover:-translate-y-0.5"
            >
              {ctaLabel} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * SiteFooter — 5-col grid, thin rules, geo marquee.
 * ────────────────────────────────────────────────────────── */
const GEOS = [
  "Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad", "Chennai",
  "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Chandigarh", "Indore",
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="overflow-hidden border-b border-rule py-6">
        <div className="geo-marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl text-warm-4">
          {[...GEOS, ...GEOS].map((g, i) => (
            <span key={`${g}-${i}`} className="flex items-center gap-10">
              {g}
              <span aria-hidden="true" className="text-warm-3">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-4">
          <Wordmark className="text-xl" />
          <p className="mt-4 max-w-xs text-sm text-warm-5">
            Bookings and calm reception desks for clinics, salons, and consulting firms.
          </p>
          <a
            href={`mailto:${SITE_CONTACT.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Book a consultation <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
        <FooterCol title="Product" links={[
          { label: "Overview", to: "/" },
          { label: "Guide", to: "/virtual-queue-guide" },
          { label: "Create account", to: "/signup" },
          { label: "Staff sign in", to: "/login" },
        ]} />
        <FooterCol title="Company" links={[
          { label: "Contact", to: "/contact" },
          { label: "Privacy Policy", to: "/privacy" },
          { label: "Terms & Conditions", to: "/terms" },
          { label: "Pride Marketing", href: SITE_CONTACT.parentUrl },
        ]} />
        <FooterCol title="Contact" links={[
          { label: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}` },
          { label: SITE_CONTACT.phone, href: `tel:${SITE_CONTACT.phoneTel}` },
          { label: "WhatsApp", href: SITE_CONTACT.whatsapp },
        ]} />
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-warm-4 md:flex-row md:items-center lg:px-10">
          <p>© {year} {SITE_CONTACT.legalEntity}. All rights reserved.</p>
          <p>Made with restraint in {SITE_CONTACT.jurisdiction.split(",").slice(-1)[0].trim()}.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to?: string; href?: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <p className="section-marker">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => {
          const external = l.href && /^https?:\/\//.test(l.href);
          return (
            <li key={l.label}>
              {l.to ? (
                <Link to={l.to} className="text-warm-5 transition-colors hover:text-ink">
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  className="text-warm-5 transition-colors hover:text-ink"
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                >
                  {l.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
