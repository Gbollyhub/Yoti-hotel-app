import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getBookingById } from "@/lib/bookings";
import { CancelButton } from "./cancel-button";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    notFound();
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Booking {booking.confirmationCode}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {booking.status === "CANCELLED" ? "Cancelled" : "Confirmed"}
        </p>
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <p className="font-medium">{booking.room.name}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {format(booking.checkIn, "EEE, MMM d yyyy")} &rarr; {format(booking.checkOut, "EEE, MMM d yyyy")}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.guests} guest{booking.guests > 1 ? "s" : ""} &middot; {booking.guestName} &middot;{" "}
          {booking.guestEmail}
        </p>
      </div>

      {booking.dinners.length > 0 && (
        <div>
          <h2 className="text-lg font-medium">Dinner nights</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {booking.dinners
              .filter((d) => d.hasDinner)
              .map((d) => (
                <li key={d.id}>{format(d.date, "EEE, MMM d yyyy")}</li>
              ))}
            {booking.dinners.every((d) => !d.hasDinner) && (
              <li className="text-zinc-600 dark:text-zinc-400">None</li>
            )}
          </ul>
        </div>
      )}

      {booking.review && (
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <h2 className="text-lg font-medium">Review</h2>
          <p className="text-sm font-medium">{booking.review.rating} / 5</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{booking.review.comment}</p>
        </div>
      )}

      {booking.status === "CONFIRMED" && <CancelButton bookingId={booking.id} />}
    </div>
  );
}
