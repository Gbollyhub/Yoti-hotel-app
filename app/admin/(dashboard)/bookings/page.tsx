import { BookingsTable } from "@/components/BookingsTable";
import { listBookings } from "@/lib/bookings";

export default async function AdminBookingsPage() {
  const bookings = await listBookings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
      <BookingsTable bookings={bookings} />
    </div>
  );
}
