export const TASK_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Incomplete",
  "Overdue",
  "Cancelled",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = "Urgent" | "High" | "Medium" | "Low";

export interface Task {
  id: string; // e.g. "TSK-8901"
  description: string;
  status: TaskStatus;
  dueAt: string;              // ISO timestamp - the actual deadline
  priority?: TaskPriority;
  assignee?: string;
  createdAt?: string;         // ISO timestamp
  completedAt?: string;       // ISO timestamp - set automatically when status becomes Completed
}