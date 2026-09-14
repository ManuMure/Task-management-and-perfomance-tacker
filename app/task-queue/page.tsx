import DashboardShell from "@/components/DashboardShell";
import TaskFilterTabs from "@/components/TaskFilterTabs";
import TaskQueueTable from "@/components/TaskQueueTable";
import NewTaskButton from "@/components/NewTaskButton";
import {
  getTasks,
  getTaskStatusCounts,
} from "@/lib/data/tasks";
import type { TaskStatus } from "@/types/task";

export default async function TaskQueuePage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: TaskStatus | "All";
  }>;
}) {
  const { status } = await searchParams;

  const activeStatus = status ?? "All";

  const [tasks, counts] = await Promise.all([
    getTasks(50, activeStatus),
    getTaskStatusCounts(),
  ]);

  const totalForView = counts[activeStatus] ?? 0;

  return (
    <DashboardShell title="Task Queue">
      <div className="flex items-center justify-between">
        <TaskFilterTabs
          counts={counts}
          activeStatus={activeStatus}
        />

        <NewTaskButton />
      </div>

      <TaskQueueTable
        tasks={tasks}
        totalCount={totalForView}
      />
    </DashboardShell>
  );
}