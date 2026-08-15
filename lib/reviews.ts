import { prisma } from "@/lib/prisma";
import { today } from "@/lib/dates";
import type { Result, ReviewSort } from "@/types";

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

export function listReviews(options: { from?: Date | null; to?: Date | null; sort?: ReviewSort } = {}) {
  const { from, to, sort = "latest" } = options;

  const createdAt: { gte?: Date; lt?: Date } = {};
  if (from) createdAt.gte = from;
  if (to) createdAt.lt = new Date(to.getTime() + 24 * 60 * 60 * 1000); 

  const orderBy =
    sort === "best"
      ? { rating: "desc" as const }
      : sort === "worst"
        ? { rating: "asc" as const }
        : { createdAt: "desc" as const };

  return prisma.review.findMany({
    where: Object.keys(createdAt).length ? { createdAt } : undefined,
    include: { booking: { include: { room: true } } },
    orderBy,
  });
}

export type ReviewListItem = Awaited<ReturnType<typeof listReviews>>[number];
