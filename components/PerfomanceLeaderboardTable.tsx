"use client";

import { onTimeRate } from "@/types/employee";
import AssigneeAvatar from "./AssigneeAvatar";

export default function PerformanceLeaderboardTable({
  employees,
}: {
  employees: {
    id: string;
    name: string;
    role: string;
    tasksCompleted: number;
    tasksOnTime: number;
  }[];
}) {
  /*
   * Rank employees by on-time completion rate.
   *
   * If two employees have the same rate,
   * the one with more completed tasks comes first.
   */
  const ranked = [...employees].sort((a, b) => {
    const rateDifference =
      onTimeRate(b) - onTimeRate(a);

    if (rateDifference !== 0) {
      return rateDifference;
    }

    return (
      b.tasksCompleted -
      a.tasksCompleted
    );
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-bold text-slate-900">
          Team Leaderboard
        </h2>

        <p className="text-sm text-slate-400">
          Ranked by on-time completion rate
        </p>
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-175 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-400">
              <th className="px-6 py-3">
                RANK
              </th>

              <th className="px-3 py-3">
                EMPLOYEE
              </th>

              <th className="px-3 py-3">
                TASKS COMPLETED
              </th>

              <th className="px-3 py-3">
                ON-TIME RATE
              </th>
            </tr>
          </thead>

          <tbody>
            {ranked.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  No active employees yet -
                  register someone to see them
                  here.
                </td>
              </tr>
            ) : (
              ranked.map((employee, index) => {
                const rate =
                  onTimeRate(employee);

                return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-50 text-sm hover:bg-slate-50/60"
                  >
                    {/* RANK */}
                    <td className="px-6 py-4 font-mono text-slate-400">
                      #{index + 1}
                    </td>

                    {/* EMPLOYEE */}
                    <td className="px-3 py-4">
                      <div className="flex flex-col">
                        <AssigneeAvatar
                          name={employee.name}
                        />

                        <span className="ml-9 text-xs text-slate-400">
                          {employee.role}
                        </span>
                      </div>
                    </td>

                    {/* TASKS COMPLETED */}
                    <td className="px-3 py-4 text-slate-700">
                      {employee.tasksCompleted}

                      <span className="text-slate-400">
                        {" "}
                        (
                        {
                          employee.tasksOnTime
                        }{" "}
                        on time)
                      </span>
                    </td>

                    {/* ON-TIME RATE */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              rate >= 95
                                ? "bg-emerald-500"
                                : rate >= 85
                                ? "bg-blue-600"
                                : "bg-amber-500"
                            }`}
                            style={{
                              width: `${rate}%`,
                            }}
                          />
                        </div>

                        <span className="font-medium text-slate-700">
                          {rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}