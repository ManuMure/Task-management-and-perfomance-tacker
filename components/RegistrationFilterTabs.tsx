import Link from "next/link";
import { REGISTRATION_STATUSES } from "@/types/registration";

const tabs = ["All", ...REGISTRATION_STATUSES];

export default function RegistrationFilterTabs({
  counts,
  activeStatus,
}: {
  counts: Record<string, number>;
  activeStatus: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((key) => {
        const isActive = activeStatus === key;
        const href =
          key === "All" ? "/registrations" : `/registrations?status=${encodeURIComponent(key)}`;
        return (
          <Link
            key={key}
            href={href}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {key}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
              }`}
            >
              {(counts[key] ?? 0).toLocaleString()}
            </span>
          </Link>
        );
      })}
    </div>
  );
}