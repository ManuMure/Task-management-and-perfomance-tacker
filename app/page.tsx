import DashboardShell from "@/components/DashboardShell";
import StatsCards from "@/components/StatsCards";
import ActiveTaskQueue from "@/components/ActiveTaskQueue";
import { getTasks, getTaskStats } from "@/lib/data/tasks";

export default async function DashboardPage() {
  const [tasks, stats] = await Promise.all([
    getTasks(4),
    getTaskStats(),
  ]);

  return (
    <DashboardShell title="Task Management">
      <StatsCards totalTasks={stats.totalTasks} />

      <ActiveTaskQueue
        tasks={tasks}
        totalCount={stats.totalTasks}
      />
    </DashboardShell>
  );
}