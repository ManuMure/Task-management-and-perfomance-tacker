import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCollection } from "@/lib/collections";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { isValidEmail, validatePassword } from "@/lib/validation";

interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    const users = await getCollection<UserDoc>("users");
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "Filing Specialist",
      createdAt: new Date().toISOString(),
    });

    const token = await createSessionToken({
      userId: result.insertedId.toString(),
      name,
      email: normalizedEmail,
    });

    const response = NextResponse.json({
      success: true,
      user: { name, email: normalizedEmail },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}