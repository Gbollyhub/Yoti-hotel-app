export type CreateBookingInput = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNightCents: number;
  capacity: number;
};

export type BookingStep = "dates" | "rooms" | "details" | "confirmed";

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export type Dinner = {
  date: string;
  hasDinner: boolean;
};

export type ReviewSummary = {
  rating: number;
  comment: string;
  createdAt: string;
};

export type BookingDetail = {
  id: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  status: BookingStatus;
  room: Room;
  dinners: Dinner[];
  review: ReviewSummary | null;
};

export type ReviewSort = "latest" | "best" | "worst";
