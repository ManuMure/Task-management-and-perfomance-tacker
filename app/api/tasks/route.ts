import { NextRequest, NextResponse } from "next/server";

import { getCollection } from "@/lib/collections";
import { getNextSequence } from "@/lib/counters";
import { getSessionFromRequest } from "@/lib/auth/session";
import { Task } from "@/types/task";

const VALID_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Incomplete",
  "Overdue",
  "Cancelled",
] as const;

type TaskStatus = (typeof VALID_STATUSES)[number];

/**
 * GET /api/tasks
 *
 * Returns tasks.
 *
 * Optional:
 * /api/tasks?status=Completed
 * /api/tasks?limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status");
    const limitParam = searchParams.get("limit") ?? "50";

    const parsedLimit = Number(limitParam);

    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 50;

    const status: TaskStatus | undefined =
      statusParam &&
      VALID_STATUSES.includes(statusParam as TaskStatus)
        ? (statusParam as TaskStatus)
        : undefined;

    const tasks = await getCollection<Task>("tasks");

    const query = status ? { status } : {};

    const docs = await tasks
      .find(query, {
        projection: {
          _id: 0,
        },
      })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      tasks: docs,
    });
  } catch (error) {
    console.error("List tasks error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/tasks
 *
 * Creates a new task.
 */
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/tasks reached");

    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    console.log("Create task body:", body);

    const {
      description,
      assignee,
      priority,
      dueAt,
    } = body;

    /*
     * Validate description.
     */
    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          error: "Description is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate due date.
     */
    if (!dueAt) {
      return NextResponse.json(
        {
          error: "Due date is required.",
        },
        {
          status: 400,
        }
      );
    }

    const dueDate = new Date(dueAt);

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid due date.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Generate task ID.
     */
    const seq = await getNextSequence("taskId");

    /*
     * Create task.
     *
     * completedAt is intentionally NOT included.
     * It will only be added when the task is completed.
     */
    const task: Task = {
      id: `TSK-${9000 + seq}`,

      description: description.trim(),

      status: "Pending",

      dueAt: dueDate.toISOString(),

      priority:
        priority || undefined,

      assignee:
        assignee || undefined,

      createdAt:
        new Date().toISOString(),
    };

    const tasks = await getCollection<Task>("tasks");

    await tasks.insertOne(task);

    console.log("Task created:", task.id);

    return NextResponse.json(
      {
        success: true,
        task,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create task error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong creating the task.",
      },
      {
        status: 500,
      }
    );
  }
}