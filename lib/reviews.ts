import { prisma } from "@/lib/prisma";
import { today } from "@/lib/dates";
import type { Result } from "@/lib/types";

export type AddReviewInput = {
  confirmationCode: string;
  rating: number;
  comment: string;
};

export async function addReview(input: AddReviewInput): Promise<Result<{ id: string }>> {
  const booking = await prisma.booking.findUnique({
    where: { confirmationCode: input.confirmationCode },
    include: { review: true },
  });
  if (!booking) {
    return { ok: false, status: 404, error: "Booking not found" };
  }
  if (booking.status === "CANCELLED") {
    return { ok: false, status: 400, error: "Cancelled bookings cannot be reviewed" };
  }
  if (booking.checkOut.getTime() > today().getTime()) {
    return { ok: false, status: 400, error: "This booking hasn't ended yet" };
  }
  if (booking.review) {
    return { ok: false, status: 409, error: "This booking has already been reviewed" };
  }

  const review = await prisma.review.create({
    data: { bookingId: booking.id, rating: input.rating, comment: input.comment },
  });

  return { ok: true, data: { id: review.id } };
}
