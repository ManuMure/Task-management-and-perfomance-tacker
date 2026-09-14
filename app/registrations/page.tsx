import DashboardShell from "@/components/DashboardShell";
import RegistrationStatsCards from "@/components/RegistrationStatsCards";
import RegistrationFilterTabs from "@/components/RegistrationFilterTabs";
import RegistrationsTable from "@/components/RegistrationsTable";
import NewRegistrationButton from "@/components/NewRegistrationButton";

import {
  getRegistrations,
  getRegistrationStats,
  getRegistrationStatusCounts,
} from "@/lib/data/registrations";

import type { RegistrationStatus } from "@/types/registration";

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: RegistrationStatus | "All";
  }>;
}) {
  const { status } = await searchParams;

  const activeStatus = status ?? "All";

  const [registrations, stats, counts] = await Promise.all([
    getRegistrations(50, activeStatus),
    getRegistrationStats(),
    getRegistrationStatusCounts(),
  ]);

  const totalForView = counts[activeStatus] ?? 0;

  return (
    <DashboardShell title="Employee Registrations">
      <RegistrationStatsCards
        totalEmployees={stats.totalEmployees}
        activeRatePercent={stats.activeRatePercent}
      />

      <div className="flex items-center justify-between">
        <RegistrationFilterTabs
          counts={counts}
          activeStatus={activeStatus}
        />

        <NewRegistrationButton />
      </div>

      <RegistrationsTable
        registrations={registrations}
        totalCount={totalForView}
      />
    </DashboardShell>
  );
}