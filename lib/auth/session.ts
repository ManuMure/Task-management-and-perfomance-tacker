import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "brs_session";

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error(
    "Missing AUTH_SECRET. Add a random string to .env.local, e.g.:\n" +
      `  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  );
}
const encodedSecret = new TextEncoder().encode(secret);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as SessionPayload;
  } catch {
    return null; // expired, tampered, or malformed
  }
}

/** Convenience helper for API routes that require a logged-in user. */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}