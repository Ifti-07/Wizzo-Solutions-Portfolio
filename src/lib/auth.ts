import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "wizzo_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "wizzo-dev-secret-change-me-in-production-0123456789abcdef"
);

export type SessionPayload = {
  uid: number;
  role: "ADMIN" | "EMPLOYEE" | "INTERN";
  name: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      uid: payload.uid as number,
      role: payload.role as SessionPayload["role"],
      name: payload.name as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  try {
    const [user] = await db.select().from(users).where(eq(users.id, session.uid)).limit(1);
    if (!user || user.status !== "ACTIVE") return null;
    return user;
  } catch {
    return {
      id: session.uid,
      name: session.name,
      email: session.email,
      role: session.role,
      status: "ACTIVE",
      createdAt: new Date(),
    } as any;
  }
}

export async function requireRole(...roles: SessionPayload["role"][]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) return null;
  return session;
}

export async function logAudit(userId: number | null, action: string, details = "") {
  try {
    await db.insert(auditLogs).values({ userId, action, details });
  } catch {
    // audit failures should never break the request
  }
}
