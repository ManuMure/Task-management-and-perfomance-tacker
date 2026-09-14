export interface SlaStatus {
  label: string; // e.g. "04:12:00" or "-01:15:30" if overdue
  isBreachRisk: boolean;
  isOverdue: boolean;
}

const BREACH_RISK_THRESHOLD_MS = 2 * 60 * 60 * 1000; // under 2h left counts as at-risk

// Only tasks still actively being worked count down live - a Completed,
// Cancelled, Incomplete, or already-flagged-Overdue task doesn't need a
// ticking clock.
const LIVE_STATUSES = new Set(["Pending", "In Progress"]);

export function getSlaStatus(dueAt: string, status: string): SlaStatus {
  if (!LIVE_STATUSES.has(status)) {
    return { label: "—", isBreachRisk: false, isOverdue: status === "Overdue" };
  }

  const msRemaining = new Date(dueAt).getTime() - Date.now();
  const isOverdue = msRemaining < 0;
  const isBreachRisk = isOverdue || msRemaining < BREACH_RISK_THRESHOLD_MS;

  const abs = Math.abs(msRemaining);
  const hours = Math.floor(abs / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((abs % (1000 * 60)) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    label: `${isOverdue ? "-" : ""}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    isBreachRisk,
    isOverdue,
  };
}