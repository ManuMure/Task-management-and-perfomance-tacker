"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./ui/Modal";
import { TaskPriority } from "@/types/task";
import { Registration } from "@/types/registration";

const priorities: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

export default function NewTaskButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [employees, setEmployees] = useState<Registration[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  /**
   * Open modal and load active employees.
   */
  const handleOpen = async () => {
    setOpen(true);
    setError("");
    setIsLoadingEmployees(true);

    try {
      const res = await fetch("/api/registrations?status=Active");

      if (!res.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await res.json();

      setEmployees(data.registrations ?? []);
    } catch {
      setEmployees([]);
      setError("Unable to load active employees.");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const resetAndClose = () => {
    setDescription("");
    setAssignee("");
    setPriority("Medium");
    setDueAt("");
    setError("");
    setOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!description.trim() || !dueAt) {
      setError("Description and due date are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          assignee,
          priority,
          dueAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ?? "Something went wrong creating the task."
        );
        return;
      }

      resetAndClose();

      // Refresh the Server Component so the new task appears.
      router.refresh();
    } catch {
      setError("Unable to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New Task
      </button>

      {open && (
        <Modal title="New Task" onClose={resetAndClose}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* DESCRIPTION */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                DESCRIPTION
              </label>

              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Annual Return Processing - Beta LLC"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ASSIGNEE + PRIORITY */}
            <div className="grid grid-cols-2 gap-4">
              {/* ASSIGNEE */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                  ASSIGNEE
                </label>

                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  disabled={isLoadingEmployees}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {isLoadingEmployees
                      ? "Loading employees..."
                      : "Unassigned"}
                  </option>

                  {!isLoadingEmployees &&
                    employees.length === 0 && (
                      <option disabled>
                        No active employees registered
                      </option>
                    )}

                  {!isLoadingEmployees &&
                    employees.map((emp) => (
                      <option
                        key={emp.id}
                        value={emp.fullName}
                      >
                        {emp.fullName} — {emp.role}
                      </option>
                    ))}
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                  PRIORITY
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value as TaskPriority
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DUE DATE */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                DUE DATE &amp; TIME
              </label>

              <input
                type="datetime-local"
                required
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Task"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}