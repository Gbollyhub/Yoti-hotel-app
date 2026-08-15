import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import { parseDateOnly, today } from "@/lib/dates";
import { errorResponse } from "@/lib/http";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "Invalid JSON body");
  }

  const { roomId, checkIn: checkInRaw, checkOut: checkOutRaw, guests, guestName, guestEmail } = body;

  const checkIn = typeof checkInRaw === "string" ? parseDateOnly(checkInRaw) : null;
  const checkOut = typeof checkOutRaw === "string" ? parseDateOnly(checkOutRaw) : null;

  if (typeof roomId !== "string" || !roomId) {
    return errorResponse(400, "roomId is required");
  }
  if (!checkIn || !checkOut) {
    return errorResponse(400, "checkIn and checkOut are required, as yyyy-MM-dd");
  }
  if (checkIn.getTime() < today().getTime()) {
    return errorResponse(400, "checkIn cannot be in the past");
  }
  if (checkOut.getTime() <= checkIn.getTime()) {
    return errorResponse(400, "checkOut must be after checkIn");
  }
  if (guests !== 1 && guests !== 2) {
    return errorResponse(400, "guests must be 1 or 2");
  }
  if (typeof guestName !== "string" || !guestName.trim()) {
    return errorResponse(400, "guestName is required");
  }
  if (typeof guestEmail !== "string" || !EMAIL_RE.test(guestEmail)) {
    return errorResponse(400, "guestEmail is invalid");
  }

  const result = await createBooking({
    roomId,
    checkIn,
    checkOut,
    guests,
    guestName: guestName.trim(),
    guestEmail: guestEmail.trim(),
  });

  if (!result.ok) {
    return errorResponse(result.status, result.error);
  }
  return NextResponse.json(result.data, { status: 201 });
}
