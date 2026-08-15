import { NextRequest, NextResponse } from "next/server";
import { getDinnersForDate } from "@/lib/dinners";
import { parseDateOnly, today } from "@/lib/dates";
import { errorResponse } from "@/lib/http";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");
  const date = dateParam ? parseDateOnly(dateParam) : today();
  if (!date) {
    return errorResponse(400, "date must be yyyy-MM-dd");
  }

  const dinners = await getDinnersForDate(date);
  return NextResponse.json({ dinners });
}
