import Link from "next/link";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { BookingListItem } from "@/lib/bookings";

export function BookingsTable({ bookings }: { bookings: BookingListItem[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/15">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-black/10 text-zinc-600 dark:border-white/15 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">Room</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Guest</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-black/10 last:border-0 dark:border-white/15">
              <td className="px-4 py-3">
                <Link href={`/admin/bookings/${booking.id}`} className="font-mono underline underline-offset-2">
                  {booking.confirmationCode}
                </Link>
              </td>
              <td className="px-4 py-3">{booking.room.name}</td>
              <td className="px-4 py-3">
                {format(booking.checkIn, "MMM d")} &rarr; {format(booking.checkOut, "MMM d yyyy")}
              </td>
              <td className="px-4 py-3">{booking.guestName}</td>
              <td className="px-4 py-3">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
