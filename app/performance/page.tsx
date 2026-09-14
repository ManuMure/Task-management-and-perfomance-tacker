import DashboardShell from "@/components/DashboardShell";
import PerformanceStatsCards from "@/components/PerfomanceStatsCards";
import PerformanceLeaderboardTable from "@/components/PerfomanceLeaderboardTable";
import { getEmployeePerformance } from "@/lib/data/perfomance";

export default async function PerformancePage() {
  const employees = await getEmployeePerformance();

  return (
    <DashboardShell title="Performance">
      <PerformanceStatsCards employees={employees} />
      <PerformanceLeaderboardTable employees={employees} />
    </DashboardShell>
  );
}