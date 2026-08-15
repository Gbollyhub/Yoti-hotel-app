import { prisma } from "@/lib/prisma";

/** Bookings needing dinner on a given date, excluding cancelled bookings. */
export function getDinnersForDate(date: Date) {
  return prisma.bookingDinner.findMany({
    where: { date, hasDinner: true, booking: { status: "CONFIRMED" } },
    include: { booking: { include: { room: true } } },
    orderBy: { booking: { room: { name: "asc" } } },
  });
}
