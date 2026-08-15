import { notFound } from "next/navigation";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";
import { BookingInfoCard } from "@/components/BookingInfoCard";
import { ReviewSummaryCard } from "@/components/ReviewSummaryCard";
import { AdminCancelBookingAction } from "@/components/AdminCancelBookingAction";
import { getBookingById } from "@/lib/bookings";

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
          <StatusBadge status={booking.status} />
        </p>
      </div>

      <BookingInfoCard
        roomName={booking.room.name}
        checkIn={booking.checkIn}
        checkOut={booking.checkOut}
        guests={booking.guests}
        guestName={booking.guestName}
        guestEmail={booking.guestEmail}
      />

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

      {booking.review && <ReviewSummaryCard title="Review" {...booking.review} />}

      {booking.status === "CONFIRMED" && <AdminCancelBookingAction bookingId={booking.id} />}
    </div>
  );
}
