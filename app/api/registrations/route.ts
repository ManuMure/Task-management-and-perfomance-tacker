import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/collections";
import { getNextSequence } from "@/lib/counters";
import { getSessionFromRequest } from "@/lib/auth/session";
import { Registration, RegistrationStatus } from "@/types/registration";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Number(searchParams.get("limit") ?? "100");

    const registrations = await getCollection<Registration>("registrations");
    const query =
      status && status !== "All" ? { status: status as RegistrationStatus } : {};
    const docs = await registrations
      .find(query, { projection: { _id: 0 } })
      .sort({ fullName: 1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ registrations: docs });
  } catch (error) {
    console.error("List registrations error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, email, role, department } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const registrations = await getCollection<Registration>("registrations");
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await registrations.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An employee with that email is already registered." },
        { status: 409 }
      );
    }

    const seq = await getNextSequence("registrationId");
    const registration: Registration = {
      id: `EMP-${1000 + seq}`,
      fullName,
      email: normalizedEmail,
      role: role || "Team Member",
      department: department || "General",
      status: "Active",
      registeredAt: new Date().toISOString(),
    };

    await registrations.insertOne(registration);

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error("Create registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong registering the employee." },
      { status: 500 }
    );
  }
}