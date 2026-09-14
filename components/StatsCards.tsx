import { Archive } from "lucide-react";

export default function StatsCards({
  totalTasks,
}: {
  totalTasks: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Total Tasks */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            TOTAL TASKS
          </span>

          <Archive size={18} className="text-blue-600" />
        </div>

        <p className="text-4xl font-bold text-slate-900">
          {totalTasks.toLocaleString()}
        </p>
      </div>
    </div>
  );
}