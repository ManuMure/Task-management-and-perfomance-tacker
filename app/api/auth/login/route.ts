import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/collections";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

interface UserDoc {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const users = await getCollection<UserDoc>("users");
    const user = await users.findOne({ email: email.toLowerCase().trim() });

    // Same error for "no such user" and "wrong password" - don't reveal
    // which one it was.
    if (!user) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}