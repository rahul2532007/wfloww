import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "owner" | "admin" | "doctor";

export interface AuthProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: Role;
  business_id: string | null;
  business_slug: string | null;
  business_active: boolean;
}

interface AuthState {
  session: Session | null;
  profile: AuthProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

async function fetchProfile(userId: string, email: string): Promise<AuthProfile> {
  const [{ data: prof }, { data: roles }, { data: biz }] = await Promise.all([
    supabase.from("profiles").select("id, email, display_name").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role, business_id").eq("user_id", userId),
    supabase.from("businesses").select("id, slug, is_active, manual_lock, expires_at").eq("owner_user_id", userId).maybeSingle(),
  ]);
  const rolesArr = roles ?? [];
  const isAdmin = rolesArr.some((r: any) => r.role === "admin");
  const doctorRow = rolesArr.find((r: any) => r.role === "doctor");
  const role: Role = isAdmin ? "admin" : doctorRow ? "doctor" : "owner";

  let businessId = biz?.id ?? null;
  let businessSlug = biz?.slug ?? null;
  let businessActive = !!(biz && biz.is_active && !biz.manual_lock && biz.expires_at && new Date(biz.expires_at).getTime() > Date.now());

  if (role === "doctor" && doctorRow?.business_id) {
    businessId = doctorRow.business_id;
    const { data: docBiz } = await supabase.from("businesses").select("id, slug, is_active, manual_lock, expires_at").eq("id", doctorRow.business_id).maybeSingle();
    businessSlug = docBiz?.slug ?? null;
    businessActive = !!(docBiz && docBiz.is_active && !docBiz.manual_lock && docBiz.expires_at && new Date(docBiz.expires_at).getTime() > Date.now());
  }

  return {
    id: userId,
    email: prof?.email ?? email,
    display_name: prof?.display_name ?? null,
    role,
    business_id: businessId,
    business_slug: businessSlug,
    business_active: businessActive,
  };
}

type PendingSignup = { display_name: string | null; business_name: string; slug: string; type: "clinic" | "salon" | "consulting" };

function readPendingFromMetadata(meta: Record<string, unknown> | undefined): PendingSignup | null {
  if (!meta) return null;
  const name = meta.pending_business_name;
  const slug = meta.pending_business_slug;
  const type = meta.pending_business_type;
  if (typeof name !== "string" || typeof slug !== "string" || typeof type !== "string") return null;
  if (!["clinic", "salon", "consulting"].includes(type)) return null;
  return {
    display_name: typeof meta.display_name === "string" ? (meta.display_name as string) : null,
    business_name: name,
    slug,
    type: type as PendingSignup["type"],
  };
}

function readPendingFromLocalStorage(email: string): PendingSignup | null {
  if (typeof window === "undefined") return null;
  const emailKey = email.trim().toLowerCase();
  let raw = localStorage.getItem(`qfloww:pending-signup:${emailKey}`);
  if (!raw) {
    const last = localStorage.getItem("qfloww:pending-signup:last");
    if (last) {
      try {
        const parsed = JSON.parse(last);
        if (parsed?.email === emailKey) raw = last;
      } catch {}
    }
  }
  if (!raw) return null;
  try { return JSON.parse(raw) as PendingSignup; } catch { return null; }
}

async function finalizePendingSignup(userId: string, email: string, displayNameFallback: string | null, userMeta: Record<string, unknown> | undefined) {
  const pending = readPendingFromMetadata(userMeta) ?? readPendingFromLocalStorage(email);
  if (!pending) return false;
  try {
    await supabase.from("profiles").upsert({ id: userId, email, display_name: pending.display_name ?? displayNameFallback }, { onConflict: "id" });
    const { data: bizRow, error: bizErr } = await supabase.from("businesses").insert({
      name: pending.business_name,
      slug: pending.slug,
      type: pending.type,
      owner_user_id: userId,
      is_active: false,
      manual_lock: true,
    }).select("id").maybeSingle();
    let businessId = bizRow?.id ?? null;
    if (bizErr && !/duplicate/i.test(bizErr.message)) {
      console.error("Finalize signup failed:", bizErr.message);
      return false;
    }
    if (!businessId) {
      const { data: existing } = await supabase.from("businesses").select("id").eq("owner_user_id", userId).maybeSingle();
      businessId = existing?.id ?? null;
    }
    if (businessId) {
      const { data: existingReq } = await supabase
        .from("activation_requests")
        .select("id")
        .eq("business_id", businessId)
        .eq("requested_by", userId)
        .eq("status", "pending")
        .maybeSingle();
      if (!existingReq) {
        const { error: reqErr } = await supabase.from("activation_requests").insert({
          business_id: businessId,
          requested_by: userId,
          message: "Auto-created on signup",
        });
        if (reqErr) console.error("Activation request insert failed:", reqErr.message);
      }
    }
    // Clear metadata + localStorage so we don't reattempt.
    try {
      await supabase.auth.updateUser({ data: { pending_business_name: null, pending_business_slug: null, pending_business_type: null } });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem(`qfloww:pending-signup:${email.trim().toLowerCase()}`);
      localStorage.removeItem("qfloww:pending-signup:last");
    }
    return true;
  } catch (e) {
    console.error("Finalize signup error:", e);
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (s: Session | null) => {
    setSession(s);
    if (!s) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let prof = await fetchProfile(s.user.id, s.user.email ?? "");
    if (!prof.business_id) {
      const finalized = await finalizePendingSignup(s.user.id, s.user.email ?? "", prof.display_name, s.user.user_metadata as Record<string, unknown> | undefined);
      if (finalized) prof = await fetchProfile(s.user.id, s.user.email ?? "");
    }
    setProfile(prof);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => { if (mounted) load(data.session); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load(s);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const value: AuthState = {
    session,
    profile,
    loading,
    refresh: async () => {
      if (session) setProfile(await fetchProfile(session.user.id, session.user.email ?? ""));
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setProfile(null);
      setSession(null);
    },
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function homeForRole(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "doctor") return "/doctor";
  return "/management";
}
