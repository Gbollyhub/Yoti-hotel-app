import { NextResponse } from "next/server";
import { setDinners } from "@/lib/bookings";
import { parseDateOnly } from "@/lib/dates";
import { errorResponse } from "@/lib/http";

type Params = { params: Promise<{ code: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { code } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.nights)) {
    return errorResponse(400, "nights is required, as [{ date, hasDinner }]");
  }

  const nights: { date: Date; hasDinner: boolean }[] = [];
  for (const night of body.nights) {
    const date = typeof night?.date === "string" ? parseDateOnly(night.date) : null;
    if (!date || typeof night?.hasDinner !== "boolean") {
      return errorResponse(400, "each night needs a yyyy-MM-dd date and a boolean hasDinner");
    }
    nights.push({ date, hasDinner: night.hasDinner });
  }

  const result = await setDinners(code, nights);
  if (!result.ok) {
    return errorResponse(result.status, result.error);
  }
  return NextResponse.json({ ok: true });
}
