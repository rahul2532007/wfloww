import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, ArrowUpRight, ChevronDown, Copy, Check, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Wordmark } from "@/components/site/primitives";

export type SlotInfo = {
  id: string;
  name: string;
  start_time?: string | null;
  end_time?: string | null;
  max_capacity?: number | null;
  booked_today?: number;
};

export function StaffTopNav({
  title,
  extra,
  addLabel,
  onAdd,
  businessSlug,
  slots,
}: {
  title: string;
  extra?: React.ReactNode;
  addLabel?: string;
  onAdd?: () => void;
  businessSlug?: string | null;
  slots?: SlotInfo[];
}) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location?.pathname ?? "" });
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!panelOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [panelOpen]);

  const tabs =
    profile?.role === "admin"
      ? [
          { href: "/admin", label: "Admin" },
          { href: "/management", label: "Bookings" },
          { href: "/management/history", label: "History" },
        ]
      : profile?.role === "owner"
        ? [
            { href: "/management", label: "Bookings" },
            { href: "/management/history", label: "History" },
          ]
        : [];

  const isActive = (href: string) => {
    if (href === "/management") return pathname === "/management" || pathname === "/management/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const publicUrl = businessSlug
    ? (typeof window !== "undefined" ? `${window.location.origin}/book/${businessSlug}` : `/book/${businessSlug}`)
    : null;

  const copy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const titleInteractive = !!businessSlug;

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Home" className="flex items-center">
              <Wordmark />
            </Link>
            <span aria-hidden className="hidden h-4 w-px bg-rule sm:block" />
            {titleInteractive ? (
              <div className="relative" ref={panelRef}>
                <button
                  type="button"
                  onClick={() => setPanelOpen((v) => !v)}
                  aria-expanded={panelOpen}
                  aria-haspopup="dialog"
                  className="hidden items-center gap-1 font-display text-sm text-warm-5 transition-colors hover:text-ink sm:inline-flex"
                >
                  {title}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${panelOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {panelOpen && (
                  <div
                    role="dialog"
                    aria-label="Business booking link and slots"
                    className="absolute left-0 top-full z-30 mt-3 w-[min(92vw,26rem)] border border-rule bg-paper p-4 shadow-xl"
                  >
                    <p className="section-marker">Public booking link</p>
                    <div className="mt-2 flex items-stretch gap-2">
                      <input
                        readOnly
                        value={publicUrl ?? ""}
                        onFocus={(e) => e.currentTarget.select()}
                        className="min-w-0 flex-1 rounded-none border border-rule bg-warm-1 px-2 py-1.5 text-xs text-ink"
                        aria-label="Public booking URL"
                      />
                      <button
                        onClick={copy}
                        className="inline-flex items-center gap-1 rounded-none border border-rule px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
                        aria-label="Copy link"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      {publicUrl && (
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-none border border-rule px-2 py-1.5 text-warm-5 transition-colors hover:bg-ink hover:text-paper"
                          aria-label="Open booking page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    <p className="section-marker mt-5">Slots</p>
                    {!slots || slots.length === 0 ? (
                      <p className="mt-2 text-xs text-warm-5">No active slots configured.</p>
                    ) : (
                      <ul className="mt-2 divide-y divide-rule border border-rule">
                        {slots.map((s) => {
                          const time = s.start_time || s.end_time
                            ? `${(s.start_time ?? "").slice(0, 5) || "—"}–${(s.end_time ?? "").slice(0, 5) || "—"}`
                            : null;
                          const cap = s.max_capacity ?? null;
                          const booked = s.booked_today ?? 0;
                          const full = cap != null && booked >= cap;
                          return (
                            <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                              <div className="min-w-0">
                                <div className="truncate font-medium text-ink">{s.name}</div>
                                {time && <div className="text-warm-5">{time}</div>}
                              </div>
                              <div className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${full ? "border-amber bg-amber/10 text-amber" : "border-rule bg-warm-1 text-warm-5"}`}>
                                {cap != null ? `${booked}/${cap}` : `${booked}`} today
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <span className="hidden font-display text-sm text-warm-5 sm:block">{title}</span>
            )}
          </div>
          <nav aria-label="Staff sections" className="flex items-center gap-6">
            {tabs.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className={`text-sm transition-colors ${
                  isActive(t.href) ? "text-ink" : "text-warm-5 hover:text-ink"
                }`}
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {extra}
          {onAdd && addLabel && (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-90"
            >
              + {addLabel}
            </button>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login", replace: true });
            }}
            aria-label="Log out"
            title="Log out"
            className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-xs text-warm-5 hover:bg-ink hover:text-paper"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    booked: "border-rule bg-warm-1 text-warm-5",
    arrived: "border-rule bg-warm-1 text-ink",
    ongoing: "border-amber bg-amber/10 text-amber",
    completed: "border-ink bg-ink text-paper",
    cancelled: "border-rule bg-warm-1 text-warm-4 line-through",
    no_show: "border-rule bg-warm-1 text-warm-4",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
        map[status] ?? "border-rule bg-warm-1 text-warm-5"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function Forbidden() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 text-center">
      <div>
        <p className="section-marker">403 — Forbidden</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.02em]">Not your desk.</h1>
        <p className="mt-3 text-sm text-warm-5">You don't have permission to view this page.</p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition">
          Sign in with a different account <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
