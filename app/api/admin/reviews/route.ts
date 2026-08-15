import { NextRequest, NextResponse } from "next/server";
import { listReviews, type ReviewSort } from "@/lib/reviews";
import { parseDateOnly } from "@/lib/dates";
import { errorResponse } from "@/lib/http";

const SORTS: ReviewSort[] = ["latest", "best", "worst"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = parseDateOnly(params.get("from"));
  const to = parseDateOnly(params.get("to"));
  const sortParam = params.get("sort") ?? "latest";

  if (!SORTS.includes(sortParam as ReviewSort)) {
    return errorResponse(400, "sort must be one of latest, best, worst");
  }

  const reviews = await listReviews({ from, to, sort: sortParam as ReviewSort });
  return NextResponse.json({ reviews });
}
