import type { DinnerEntry } from "@/lib/dinners";

export function DinnerScheduleList({ label, dinners }: { label: string; dinners: DinnerEntry[] }) {
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
