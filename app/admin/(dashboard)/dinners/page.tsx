import { addDays } from "date-fns";
import { format } from "date-fns";
import { getDinnersForDate } from "@/lib/dinners";
import { today } from "@/lib/dates";

function DinnerList({ label, dinners }: { label: string; dinners: Awaited<ReturnType<typeof getDinnersForDate>> }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">
        {label} &middot; {dinners.length} dinner{dinners.length === 1 ? "" : "s"}
      </h2>
      {dinners.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Nothing to prepare.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {dinners.map((dinner) => (
            <li
              key={dinner.id}
              className="flex items-center justify-between rounded-md border border-black/10 px-4 py-3 text-sm dark:border-white/15"
            >
              <span>{dinner.booking.room.name}</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {dinner.booking.guests} guest{dinner.booking.guests > 1 ? "s" : ""} &middot;{" "}
                {dinner.booking.guestName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminDinnersPage() {
  const [todayDinners, tomorrowDinners] = await Promise.all([
    getDinnersForDate(today()),
    getDinnersForDate(addDays(today(), 1)),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dinners</h1>
      <DinnerList label={`Today, ${format(today(), "MMM d")}`} dinners={todayDinners} />
      <DinnerList label={`Tomorrow, ${format(addDays(today(), 1), "MMM d")}`} dinners={tomorrowDinners} />
    </div>
  );
}
