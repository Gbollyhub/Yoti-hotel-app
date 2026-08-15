import { prisma } from "@/lib/prisma";
import { isRoomAvailable } from "@/lib/availability";
import { generateConfirmationCode } from "@/lib/confirmation-code";
import { nightsBetween } from "@/lib/dates";
import type { CreateBookingInput, Result } from "@/lib/types";

export async function createBooking(
  input: CreateBookingInput,
): Promise<Result<{ confirmationCode: string }>> {
  const room = await prisma.room.findUnique({ where: { id: input.roomId } });
  if (!room) {
    return { ok: false, status: 404, error: "Room not found" };
  }
  if (input.guests > room.capacity) {
    return {
      ok: false,
      status: 400,
      error: `This room fits at most ${room.capacity} guest(s)`,
    };
  }

  return prisma.$transaction(async (tx) => {
    const available = await isRoomAvailable(
      tx,
      input.roomId,
      input.checkIn,
      input.checkOut,
    );
    if (!available) {
      return {
        ok: false,
        status: 409,
        error: "This room is no longer available for those dates",
      };
    }

    const confirmationCode = await generateConfirmationCode(tx);
    await tx.booking.create({
      data: {
        confirmationCode,
        roomId: input.roomId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
      },
    });

    return { ok: true, data: { confirmationCode } };
  });
}

export function getBookingByCode(code: string) {
  return prisma.booking.findUnique({
    where: { confirmationCode: code },
    include: { room: true, dinners: true, review: true },
  });
}

export async function cancelBooking(
  code: string,
): Promise<Result<{ id: string }>> {
  const booking = await prisma.booking.findUnique({
    where: { confirmationCode: code },
  });
  if (!booking) {
    return { ok: false, status: 404, error: "Booking not found" };
  }
  if (booking.status === "CANCELLED") {
    return { ok: false, status: 400, error: "Booking is already cancelled" };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });
  return { ok: true, data: { id: booking.id } };
}

export async function setDinners(
  code: string,
  nights: { date: Date; hasDinner: boolean }[],
): Promise<Result<{ id: string }>> {
  const booking = await prisma.booking.findUnique({
    where: { confirmationCode: code },
  });
  if (!booking) {
    return { ok: false, status: 404, error: "Booking not found" };
  }
  if (booking.status === "CANCELLED") {
    return { ok: false, status: 400, error: "Booking is cancelled" };
  }

  const validDates = new Set(
    nightsBetween(booking.checkIn, booking.checkOut).map((d) => d.getTime()),
  );
  for (const night of nights) {
    if (!validDates.has(night.date.getTime())) {
      return {
        ok: false,
        status: 400,
        error: "date is not a night of this booking",
      };
    }
  }

  await prisma.$transaction(
    nights.map((night) =>
      prisma.bookingDinner.upsert({
        where: { bookingId_date: { bookingId: booking.id, date: night.date } },
        create: {
          bookingId: booking.id,
          date: night.date,
          hasDinner: night.hasDinner,
        },
        update: { hasDinner: night.hasDinner },
      }),
    ),
  );

  return { ok: true, data: { id: booking.id } };
}
