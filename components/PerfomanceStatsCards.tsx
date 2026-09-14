import {
  Users,
  Target,
  Trophy,
  ArrowUp,
} from "lucide-react";

import {
  EmployeePerformance,
  onTimeRate,
} from "@/types/employee";

interface PerformanceStatsCardsProps {
  employees: EmployeePerformance[];
}

export default function PerformanceStatsCards({
  employees,
}: PerformanceStatsCardsProps) {
  /*
   * Total completed tasks across the team.
   */
  const totalCompleted =
    employees.reduce(
      (sum, employee) =>
        sum + employee.tasksCompleted,
      0
    );

  /*
   * Total tasks completed on time.
   */
  const totalOnTime =
    employees.reduce(
      (sum, employee) =>
        sum + employee.tasksOnTime,
      0
    );

  /*
   * Overall team on-time rate.
   */
  const teamRate =
    totalCompleted === 0
      ? 0
      : Math.round(
          (totalOnTime / totalCompleted) *
            100
        );

  /*
   * Find the employee with the highest
   * on-time rate.
   *
   * If rates are equal, completed task
   * count is used as the tie-breaker.
   */
  const topPerformer =
    employees.length > 0
      ? [...employees].sort((a, b) => {
          const rateDifference =
            onTimeRate(b) -
            onTimeRate(a);

          if (rateDifference !== 0) {
            return rateDifference;
          }

          return (
            b.tasksCompleted -
            a.tasksCompleted
          );
        })[0]
      : null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* TEAM ON-TIME RATE */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            TEAM ON-TIME RATE
          </span>

          <Target
            size={18}
            className="text-blue-600"
          />
        </div>

        <div className="mb-2 flex items-end justify-between">
          <p className="text-4xl font-bold text-slate-900">
            {teamRate}%
          </p>

          <span className="text-sm text-slate-400">
            Target: 95%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              teamRate >= 95
                ? "bg-emerald-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${teamRate}%`,
            }}
          />
        </div>
      </div>

      {/* TASKS COMPLETED */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            TASKS COMPLETED
          </span>

          <Users
            size={18}
            className="text-blue-600"
          />
        </div>

        <p className="text-4xl font-bold text-slate-900">
          {totalCompleted}
        </p>

        <p className="mt-2 flex items-center gap-1 text-sm text-blue-600">
          <ArrowUp size={14} />

          Across {employees.length} team members
        </p>
      </div>

      {/* TOP PERFORMER */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            TOP PERFORMER
          </span>

          <Trophy
            size={18}
            className="text-blue-600"
          />
        </div>

        {topPerformer ? (
          <>
            <p className="text-2xl font-bold text-slate-900">
              {topPerformer.name}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {onTimeRate(topPerformer)}%
              {" "}on-time ·{" "}
              {topPerformer.tasksCompleted}
              {" "}tasks
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900">
              —
            </p>

            <p className="mt-2 text-sm text-slate-500">
              No completed tasks yet
            </p>
          </>
        )}
      </div>
    </div>
  );
}