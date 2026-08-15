import { NextResponse } from "next/server";
import { cancelBookingById, getBookingById } from "@/lib/bookings";
import { errorResponse } from "@/lib/http";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return errorResponse(404, "Booking not found");
  }
  return NextResponse.json({ booking });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = await cancelBookingById(id);
  if (!result.ok) {
    return errorResponse(result.status, result.error);
  }
  return NextResponse.json({ ok: true });
}
