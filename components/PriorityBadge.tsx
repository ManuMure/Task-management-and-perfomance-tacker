import { TaskPriority } from "@/types/task";

const dotColor: Record<TaskPriority, string> = {
  Urgent: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-300",
};

export default function PriorityBadge({ priority }: { priority?: TaskPriority }) {
  if (!priority) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className={`h-2 w-2 rounded-full ${dotColor[priority]}`} />
      {priority}
    </span>
  );
}