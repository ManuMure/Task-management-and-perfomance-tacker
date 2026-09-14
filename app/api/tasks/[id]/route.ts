import { NextRequest, NextResponse } from "next/server";

import { getCollection } from "@/lib/collections";
import { getSessionFromRequest } from "@/lib/auth/session";
import {
  Task,
  TASK_STATUSES,
  TaskStatus,
} from "@/types/task";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session =
      await getSessionFromRequest(request);

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

    const { id } = await params;

    const body = await request.json();

    const { status } = body;

    if (
      !TASK_STATUSES.includes(
        status as TaskStatus
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid status.",
        },
        {
          status: 400,
        }
      );
    }

    const newStatus = status as TaskStatus;

    const tasks =
      await getCollection<Task>("tasks");

    /*
     * When the task becomes Completed,
     * record the exact time it was completed.
     */
    if (newStatus === "Completed") {
      const result =
        await tasks.updateOne(
          { id },
          {
            $set: {
              status: newStatus,
              completedAt:
                new Date().toISOString(),
            },
          }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          {
            error: "Task not found.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * If a completed task is moved
     * to another status, remove the
     * completion timestamp.
     */
    const result =
      await tasks.updateOne(
        { id },
        {
          $set: {
            status: newStatus,
          },
          $unset: {
            completedAt: "",
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          error: "Task not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong updating the task.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session =
      await getSessionFromRequest(request);

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

    const { id } = await params;

    const tasks =
      await getCollection<Task>("tasks");

    const result =
      await tasks.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          error: "Task not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong deleting the task.",
      },
      {
        status: 500,
      }
    );
  }
}