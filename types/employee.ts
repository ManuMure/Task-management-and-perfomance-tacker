export interface EmployeePerformance {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  tasksOnTime: number;
}

/**
 * On-time rate is derived from actual task counts.
 */
export function onTimeRate(emp: EmployeePerformance): number {
  if (emp.tasksCompleted === 0) {
    return 0;
  }

  return Math.round(
    (emp.tasksOnTime / emp.tasksCompleted) * 100
  );
}