import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function listAvailableRooms(checkIn: Date, checkOut: Date) {
  return prisma.room.findMany({
    where: {
      bookings: {
        none: {
          status: "CONFIRMED",
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      },
    },
    orderBy: { pricePerNightCents: "asc" },
  });
}

export async function isRoomAvailable(
  tx: Prisma.TransactionClient,
  roomId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> {
  const conflict = await tx.booking.findFirst({
    where: {
      roomId,
      status: "CONFIRMED",
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { id: true },
  });
  return !conflict;
}
