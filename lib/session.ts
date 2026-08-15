import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "session";
const SESSION_TTL = "7d";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

export function createSessionToken(adminId: string): string {
  return jwt.sign({ adminId }, secret(), { expiresIn: SESSION_TTL });
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.adminId !== "string") return null;
    return payload.adminId;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const store = await cookies();
  const adminId = verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value);
  if (!adminId) return null;
  return prisma.admin.findUnique({ where: { id: adminId } });
}
