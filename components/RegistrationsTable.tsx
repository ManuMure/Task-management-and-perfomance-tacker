"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Registration } from "@/types/registration";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import ActionsMenu from "./ui/ActionsMenu";

export default function RegistrationsTable({
  registrations,
  totalCount,
}: {
  registrations: Registration[];
  totalCount: number;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = registrations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleDelete = async (id: string) => {
    await fetch(`/api/registrations/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-400">
              <th className="px-6 py-3">EMPLOYEE ID</th>
              <th className="px-3 py-3">FULL NAME</th>
              <th className="px-3 py-3">EMAIL</th>
              <th className="px-3 py-3">ROLE</th>
              <th className="px-3 py-3">DEPARTMENT</th>
              <th className="px-3 py-3">STATUS</th>
              <th className="px-3 py-3">REGISTERED</th>
              <th className="px-3 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const isConfirmingDelete = confirmDeleteId === reg.id;
              return (
                <tr
                  key={reg.id}
                  className="border-b border-slate-50 text-sm hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{reg.id}</td>
                  <td className="px-3 py-4 text-slate-700">{reg.fullName}</td>
                  <td className="px-3 py-4 text-slate-500">{reg.email}</td>
                  <td className="px-3 py-4 text-slate-500">{reg.role}</td>
                  <td className="px-3 py-4 text-slate-500">{reg.department}</td>
                  <td className="px-3 py-4">
                    <RegistrationStatusBadge status={reg.status} />
                  </td>
                  <td className="px-3 py-4 text-slate-500">
                    {new Date(reg.registeredAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <ActionsMenu
                      label={`Actions for ${reg.id}`}
                      onClose={() => setConfirmDeleteId(null)}
                    >
                      {(close) =>
                        isConfirmingDelete ? (
                          <div className="px-3 py-2">
                            <p className="mb-2 text-xs text-slate-500">
                              Remove this employee? This can&apos;t be undone.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  handleDelete(reg.id);
                                  close();
                                }}
                                className="flex-1 rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                              >
                                Remove
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
                          <button
                            onClick={() => setConfirmDeleteId(reg.id)}
                            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Remove Employee
                          </button>
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