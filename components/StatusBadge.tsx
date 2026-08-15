import type { BookingStatus } from "@/types";

export function StatusBadge({ status }: { status: BookingStatus }) {
  if (status === "CANCELLED") {
    return <span className="text-zinc-500 dark:text-zinc-400">Cancelled</span>;
  }
  return <span className="text-green-700 dark:text-green-400">Confirmed</span>;
}
