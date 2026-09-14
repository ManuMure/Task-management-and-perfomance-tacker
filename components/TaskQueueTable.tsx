"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task, TASK_STATUSES } from "@/types/task";
import { getSlaStatus } from "@/lib/sla";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import AssigneeAvatar from "./AssigneeAvatar";
import ActionsMenu from "./ui/ActionsMenu";

export default function TaskQueueTable({
  tasks,
  totalCount,
}: {
  tasks: Task[];
  totalCount: number;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleStatusChange = async (taskId: string, status: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  const handleDelete = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-400">
              <th className="px-6 py-3">TASK ID</th>
              <th className="px-3 py-3">DESCRIPTION</th>
              <th className="px-3 py-3">ASSIGNEE</th>
              <th className="px-3 py-3">PRIORITY</th>
              <th className="px-3 py-3">STATUS</th>
              <th className="px-3 py-3">SLA TIMER</th>
              <th className="px-3 py-3">CREATED</th>
              <th className="px-3 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const sla = getSlaStatus(task.dueAt, task.status);
              const isConfirmingDelete = confirmDeleteId === task.id;
              return (
                <tr
                  key={task.id}
                  className="border-b border-slate-50 text-sm hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">
                    {task.id}
                  </td>
                  <td className="px-3 py-4 text-slate-700">{task.description}</td>
                  <td className="px-3 py-4">
                    <AssigneeAvatar name={task.assignee} />
                  </td>
                  <td className="px-3 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td
                    className={`px-3 py-4 font-mono ${
                      sla.isBreachRisk ? "font-semibold text-red-600" : "text-slate-700"
                    }`}
                  >
                    {sla.label}
                  </td>
                  <td className="px-3 py-4 text-slate-500">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <ActionsMenu
                      label={`Actions for ${task.id}`}
                      onClose={() => setConfirmDeleteId(null)}
                    >
                      {(close) =>
                        isConfirmingDelete ? (
                          <div className="px-3 py-2">
                            <p className="mb-2 text-xs text-slate-500">
                              Delete this task? This can&apos;t be undone.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  handleDelete(task.id);
                                  close();
                                }}
                                className="flex-1 rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {TASK_STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  handleStatusChange(task.id, s);
                                  close();
                                }}
                                className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                                  task.status === s
                                    ? "font-semibold text-blue-600"
                                    : "text-slate-700"
                                }`}
                              >
                                Mark as {s}
                              </button>
                            ))}
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => setConfirmDeleteId(task.id)}
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
      </div>

      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-sm text-slate-500">
          Showing 1 to {pageSize} of {totalCount.toLocaleString()} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Prev
          </button>
          {[1, 2, 3].map((n) => (
            <button
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
          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}