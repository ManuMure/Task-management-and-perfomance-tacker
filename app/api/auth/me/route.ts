import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { name: session.name, email: session.email } });
}