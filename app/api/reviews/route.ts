import { NextResponse } from "next/server";
import { addReview } from "@/lib/reviews";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "Invalid JSON body");
  }

  const { confirmationCode, rating, comment } = body;

  if (typeof confirmationCode !== "string" || !confirmationCode) {
    return errorResponse(400, "confirmationCode is required");
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return errorResponse(400, "rating must be an integer 1-5");
  }
  if (typeof comment !== "string" || !comment.trim()) {
    return errorResponse(400, "comment is required");
  }

  const result = await addReview({ confirmationCode, rating, comment: comment.trim() });
  if (!result.ok) {
    return errorResponse(result.status, result.error);
  }
  return NextResponse.json({ id: result.data.id }, { status: 201 });
}
