import { Users, UserCheck } from "lucide-react";

export default function RegistrationStatsCards({
  totalEmployees,
  activeRatePercent,
}: {
  totalEmployees: number;
  activeRatePercent: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            TOTAL EMPLOYEES
          </span>
          <Users size={18} className="text-blue-600" />
        </div>
        <p className="text-4xl font-bold text-slate-900">
          {totalEmployees.toLocaleString()}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            ACTIVE RATE
          </span>
          <UserCheck size={18} className="text-blue-600" />
        </div>
        <p className="mb-2 text-4xl font-bold text-slate-900">{activeRatePercent}%</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${activeRatePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}