import { PerformanceTier } from "@/types/employee";

const styles: Record<PerformanceTier, string> = {
  Excellent: "bg-emerald-50 text-emerald-700",
  Good: "bg-blue-50 text-blue-700",
  "Needs Improvement": "bg-amber-50 text-amber-700",
};

export default function PerformanceBadge({ tier }: { tier: PerformanceTier }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[tier]}`}
    >
      {tier}
    </span>
  );
}