import "server-only";

import { getCollection } from "@/lib/collections";
import { Task } from "@/types/task";
import { Registration } from "@/types/registration";
import { EmployeePerformance } from "@/types/employee";

/**
 * Gets real employee performance from the database.
 *
 * Performance is based on completed tasks:
 *
 * tasksCompleted = total completed tasks assigned to employee
 *
 * tasksOnTime = completed tasks where completedAt <= dueAt
 */
export async function getEmployeePerformance(): Promise<
  EmployeePerformance[]
> {
  const [
    registrationsCol,
    tasksCol,
  ] = await Promise.all([
    getCollection<Registration>("registrations"),
    getCollection<Task>("tasks"),
  ]);

  /*
   * Get active employees.
   */
  const employees = await registrationsCol
    .find(
      {
        status: "Active",
      },
      {
        projection: {
          _id: 0,
        },
      }
    )
    .toArray();

  /*
   * Get completed tasks that have an assignee.
   */
  const completedTasks = await tasksCol
    .find(
      {
        status: "Completed",
        assignee: {
          $exists: true,
          $ne: "",
        },
      },
      {
        projection: {
          _id: 0,
        },
      }
    )
    .toArray();

  /*
   * Calculate performance for each employee.
   */
  return employees.map((employee) => {
    const employeeTasks = completedTasks.filter(
      (task) =>
        task.assignee === employee.fullName
    );

    const tasksCompleted =
      employeeTasks.length;

    const tasksOnTime =
      employeeTasks.filter((task) => {
        if (!task.completedAt) {
          return false;
        }

        return (
          new Date(task.completedAt).getTime() <=
          new Date(task.dueAt).getTime()
        );
      }).length;

    return {
      id: employee.id,
      name: employee.fullName,
      role: employee.role,
      tasksCompleted,
      tasksOnTime,
    };
  });
}