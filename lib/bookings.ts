import { prisma } from "@/lib/prisma";
import { isRoomAvailable } from "@/lib/availability";
import { generateConfirmationCode } from "@/lib/confirmation-code";
import type { CreateBookingInput, Result } from "@/lib/types";

export async function createBooking(
  input: CreateBookingInput,
): Promise<Result<{ confirmationCode: string }>> {
  const room = await prisma.room.findUnique({ where: { id: input.roomId } });
  if (!room) {
    return { ok: false, status: 404, error: "Room not found" };
  }
  if (input.guests > room.capacity) {
    return { ok: false, status: 400, error: `This room fits at most ${room.capacity} guest(s)` };
  }

  return prisma.$transaction(async (tx) => {
    const available = await isRoomAvailable(tx, input.roomId, input.checkIn, input.checkOut);
    if (!available) {
      return { ok: false, status: 409, error: "This room is no longer available for those dates" };
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
