import { NextResponse } from "next/server";
import { cancelBooking, getBookingByCode } from "@/lib/bookings";
import { errorResponse } from "@/lib/http";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { code } = await params;
  const booking = await getBookingByCode(code);
  if (!booking) {
    return errorResponse(404, "Booking not found");
  }
  return NextResponse.json({ booking });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { code } = await params;
  const result = await cancelBooking(code);
  if (!result.ok) {
    return errorResponse(result.status, result.error);
  }
  return NextResponse.json({ ok: true });
}
