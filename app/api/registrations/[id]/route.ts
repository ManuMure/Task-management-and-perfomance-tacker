import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/collections";
import { getSessionFromRequest } from "@/lib/auth/session";
import { Registration } from "@/types/registration";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const registrations = await getCollection<Registration>("registrations");
    const result = await registrations.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong removing the employee." },
      { status: 500 }
    );
  }
}