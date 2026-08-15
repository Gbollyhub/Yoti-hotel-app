export type CreateBookingInput = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: string };
