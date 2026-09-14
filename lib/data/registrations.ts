import "server-only";

import { getCollection } from "@/lib/collections";
import {
  type Registration,
  type RegistrationStatus,
  REGISTRATION_STATUSES,
} from "@/types/registration";

export interface RegistrationStats {
  totalEmployees: number;
  activeRatePercent: number;
}

type RegistrationFilter = RegistrationStatus | "All";

export async function getRegistrations(
  limit = 50,
  status?: RegistrationFilter
): Promise<Registration[]> {
  const collection =
    await getCollection<Registration>("registrations");

  const query =
    status && status !== "All"
      ? { status }
      : {};

  const docs = await collection
    .find(query, { projection: { _id: 0 } })
    .sort({ registeredAt: -1 })
    .limit(limit)
    .toArray();

  return docs;
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const collection =
    await getCollection<Registration>("registrations");

  const totalEmployees =
    await collection.countDocuments();

  const active =
    await collection.countDocuments({
      status: "Active",
    });

  return {
    totalEmployees,
    activeRatePercent:
      totalEmployees === 0
        ? 100
        : Math.round((active / totalEmployees) * 100),
  };
}

export type RegistrationStatusCounts =
  Record<string, number>;

export async function getRegistrationStatusCounts(): Promise<RegistrationStatusCounts> {
  const collection =
    await getCollection<Registration>("registrations");

  const counts = await Promise.all(
    REGISTRATION_STATUSES.map((status) =>
      collection.countDocuments({ status })
    )
  );

  const result: RegistrationStatusCounts = {
    All: 0,
  };

  REGISTRATION_STATUSES.forEach((status, i) => {
    result[status] = counts[i];
    result.All += counts[i];
  });

  return result;
}