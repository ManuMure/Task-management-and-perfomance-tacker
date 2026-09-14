"use client";

import { useState } from "react";
import { Task, TASK_STATUSES } from "@/types/task";
import { getSlaStatus } from "@/lib/sla";
import StatusBadge from "./StatusBadge";
import NewTaskButton from "./NewTaskButton";
import ActionsMenu from "./ui/ActionsMenu";

export default function ActiveTaskQueue({
  tasks: initialTasks,
  totalCount,
}: {
  tasks: Task[];
  totalCount: number;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(
    null
  );

  const pageSize = initialTasks.length || 4;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  const refreshTasks = async (status: string) => {
    setIsLoading(true);

    try {
      const query =
        status === "All"
          ? `/api/tasks?limit=${pageSize}`
          : `/api/tasks?status=${encodeURIComponent(
              status
            )}&limit=${pageSize}`;

      const res = await fetch(query);

      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await res.json();

      setTasks(data.tasks ?? []);
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (status: string) => {
    setFilterStatus(status);
    setPage(1);
    setConfirmDeleteId(null);

    await refreshTasks(status);
  };

  const handleStatusChange = async (
    taskId: string,
    status: string
  ) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      await refreshTasks(filterStatus);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setConfirmDeleteId(null);

      await refreshTasks(filterStatus);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-bold text-slate-900">
          Active Task Queue
        </h2>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) =>
              handleFilterChange(e.target.value)
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All statuses</option>

            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <NewTaskButton />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">
        {isLoading ? (
          <p className="px-6 pb-6 text-sm text-slate-400">
            Loading...
          </p>
        ) : tasks.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-slate-400">
            No tasks match this filter.
          </p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-400">
                <th className="px-6 py-3">
                  TASK ID
                </th>

                <th className="px-6 py-3">
                  DESCRIPTION
                </th>

                <th className="px-6 py-3">
                  STATUS
                </th>

                <th className="px-6 py-3">
                  SLA TIMER
                </th>

                <th className="px-6 py-3 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => {
                const sla = getSlaStatus(
                  task.dueAt,
                  task.status
                );

                const isConfirmingDelete =
                  confirmDeleteId === task.id;

                return (
                  <tr
                    key={task.id}
                    className="border-b border-slate-50 text-sm hover:bg-slate-50/60"
                  >
                    {/* TASK ID */}
                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                      {task.id}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4 text-slate-700">
                      {task.description}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* SLA */}
                    <td
                      className={`px-6 py-4 font-mono ${
                        sla.isBreachRisk
                          ? "font-semibold text-red-600"
                          : "text-slate-700"
                      }`}
                    >
                      {sla.label}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <ActionsMenu
                        label={`Actions for ${task.id}`}
                        onClose={() =>
                          setConfirmDeleteId(null)
                        }
                      >
                        {(close) =>
                          isConfirmingDelete ? (
                            <div className="px-3 py-2">
                              <p className="mb-2 text-xs text-slate-500">
                                Delete this task? This
                                can&apos;t be undone.
                              </p>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDelete(task.id);
                                    close();
                                  }}
                                  className="flex-1 rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                                >
                                  Delete
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmDeleteId(
                                      null
                                    );
                                    close();
                                  }}
                                  className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {TASK_STATUSES.map(
                                (status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      handleStatusChange(
                                        task.id,
                                        status
                                      );
                                      close();
                                    }}
                                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                                      task.status === status
                                        ? "font-semibold text-blue-600"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    Mark as {status}
                                  </button>
                                )
                              )}

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                role="menuitem"
                                onClick={() =>
                                  setConfirmDeleteId(
                                    task.id
                                  )
                                }
                                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete Task
                              </button>
                            </>
                          )
                        }
                      </ActionsMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-sm text-slate-500">
          Showing 1 to {tasks.length} of{" "}
          {totalCount.toLocaleString()} entries
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={page === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          {[1, 2, 3].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded-lg text-sm font-medium ${
                page === n
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {n}
            </button>
          ))}

          <span className="px-1 text-slate-400">
            ...
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={page === totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}