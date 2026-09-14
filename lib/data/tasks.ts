import "server-only";

import { getCollection } from "@/lib/collections";
import {
  type Task,
  type TaskStatus,
  TASK_STATUSES,
} from "@/types/task";

export interface TaskStats {
  slaHealthPercent: number;
  totalTasks: number;
}

type TaskFilter = TaskStatus | "All";

export async function getTasks(
  limit = 50,
  status?: TaskFilter
): Promise<Task[]> {
  const collection =
    await getCollection<Task>("tasks");

  const query =
    status && status !== "All"
      ? { status }
      : {};

  const docs = await collection
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs;
}

export async function getTaskStats(): Promise<TaskStats> {
  const collection =
    await getCollection<Task>("tasks");

  const totalTasks =
    await collection.countDocuments();

  const overdueTasks =
    await collection.countDocuments({
      status: "Overdue",
    });

  const slaHealthPercent =
    totalTasks === 0
      ? 100
      : Math.round(
          ((totalTasks - overdueTasks) / totalTasks) * 100
        );

  return {
    totalTasks,
    slaHealthPercent,
  };
}

export type TaskStatusCounts =
  Record<string, number>;

export async function getTaskStatusCounts(): Promise<TaskStatusCounts> {
  const collection =
    await getCollection<Task>("tasks");

  const counts = await Promise.all(
    TASK_STATUSES.map((status) =>
      collection.countDocuments({
        status,
      })
    )
  );

  const result: TaskStatusCounts = {
    All: 0,
  };

  TASK_STATUSES.forEach((status, i) => {
    result[status] = counts[i];
    result.All += counts[i];
  });

  return result;
}