import { TaskStatus } from "@/types/task";

const styles: Record<TaskStatus, string> = {
  Pending: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Incomplete: "bg-orange-50 text-orange-700",
  Overdue: "bg-red-50 text-red-600",
  Cancelled: "bg-slate-100 text-slate-500",
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}