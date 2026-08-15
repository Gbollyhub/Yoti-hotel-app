import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/session";
import { errorResponse } from "@/lib/http";

const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8vHqBg2Sn9dQGHhKqEQZQvzKQ3RvHq";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "Invalid JSON body");
  }

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string") {
    return errorResponse(400, "email and password are required");
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  const valid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) {
    return errorResponse(401, "Invalid email or password");
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(admin.id), SESSION_COOKIE_OPTIONS);
  return response;
}
