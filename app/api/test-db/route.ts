import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully!",
      database: process.env.MONGODB_DB,
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown MongoDB error",
      },
      { status: 500 }
    );
  }
}