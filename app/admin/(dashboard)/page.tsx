import Link from "next/link";
import { addDays } from "date-fns";
import { getDinnersForDate } from "@/lib/dinners";
import { listBookings } from "@/lib/bookings";
import { today } from "@/lib/dates";

export default async function AdminOverviewPage() {
  const [todayDinners, tomorrowDinners, bookings] = await Promise.all([
    getDinnersForDate(today()),
    getDinnersForDate(addDays(today(), 1)),
    listBookings(),
  ]);

  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Active bookings</p>
          <p className="mt-1 text-3xl font-semibold">{activeBookings}</p>
        </div>
        <Link
          href="/admin/dinners"
          className="rounded-lg border border-black/10 p-4 transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Dinners today</p>
          <p className="mt-1 text-3xl font-semibold">{todayDinners.length}</p>
        </Link>
        <Link
          href="/admin/dinners"
          className="rounded-lg border border-black/10 p-4 transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Dinners tomorrow</p>
          <p className="mt-1 text-3xl font-semibold">{tomorrowDinners.length}</p>
        </Link>
      </div>

      <div className="flex gap-4 text-sm font-medium">
        <Link href="/admin/bookings" className="underline underline-offset-2">
          View all bookings
        </Link>
        <Link href="/admin/reviews" className="underline underline-offset-2">
          View reviews
        </Link>
      </div>
    </div>
  );
}
