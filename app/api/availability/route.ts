import { NextRequest, NextResponse } from "next/server";
import { listAvailableRooms } from "@/lib/availability";
import { parseDateOnly, today } from "@/lib/dates";
import { errorResponse } from "@/lib/http";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const checkIn = parseDateOnly(params.get("checkIn"));
  const checkOut = parseDateOnly(params.get("checkOut"));

  if (!checkIn || !checkOut) {
    return errorResponse(400, "checkIn and checkOut are required, as yyyy-MM-dd");
  }
  if (checkIn.getTime() < today().getTime()) {
    return errorResponse(400, "checkIn cannot be in the past");
  }
  if (checkOut.getTime() <= checkIn.getTime()) {
    return errorResponse(400, "checkOut must be after checkIn");
  }

  const rooms = await listAvailableRooms(checkIn, checkOut);
  return NextResponse.json({ rooms });
}
