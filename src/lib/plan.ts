// Plan/lifecycle helpers — pure functions, safe to import anywhere.

export type PlanType = "trial" | "monthly" | "yearly";
export type PlanState = "active" | "warning" | "grace" | "locked";

const PLAN_RULES: Record<PlanType, { active: number; grace: number }> = {
  trial: { active: 7, grace: 0 },
  monthly: { active: 31, grace: 7 },
  yearly: { active: 365, grace: 31 },
};

export interface PlanInput {
  plan: PlanType;
  plan_start: string; // YYYY-MM-DD
  is_active: boolean;
  manual_lock: boolean;
  expires_at?: string | null; // authoritative expiry when set by admin activation/extension
}

export interface PlanStatus {
  state: PlanState;
  daysUntilExpiry: number; // negative if past expiry (still in grace or locked)
  daysUntilLockout: number; // negative if locked
  expiryDate: Date; // end of active period
  lockoutDate: Date; // end of grace period
}

export function computePlanStatus(b: PlanInput, now: Date = new Date()): PlanStatus {
  const rules = PLAN_RULES[b.plan];
  // Prefer authoritative expires_at (written by admin activation / extension) over
  // plan_start + rules, so extending a business updates the banner immediately even
  // when plan/plan_start were not rewritten.
  let expiry: Date;
  if (b.expires_at) {
    expiry = new Date(b.expires_at);
  } else {
    const start = new Date(b.plan_start + "T00:00:00");
    expiry = new Date(start);
    expiry.setDate(expiry.getDate() + rules.active);
  }
  const lockout = new Date(expiry);
  lockout.setDate(lockout.getDate() + rules.grace);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / msPerDay);
  const daysUntilLockout = Math.ceil((lockout.getTime() - now.getTime()) / msPerDay);

  let state: PlanState;
  if (b.manual_lock || !b.is_active) state = "locked";
  else if (daysUntilLockout <= 0) state = "locked";
  else if (daysUntilExpiry <= 0) state = "grace";
  else if (daysUntilExpiry <= 5) state = "warning";
  else state = "active";

  return { state, daysUntilExpiry, daysUntilLockout, expiryDate: expiry, lockoutDate: lockout };
}

export function planStateLabel(s: PlanState): string {
  return { active: "Active", warning: "Warning", grace: "Grace", locked: "Locked" }[s];
}
