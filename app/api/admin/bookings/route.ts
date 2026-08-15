import { NextResponse } from "next/server";
import { listBookings } from "@/lib/bookings";

export async function GET() {
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}
