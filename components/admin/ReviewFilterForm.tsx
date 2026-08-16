import { Button } from "@/components/ui/Button";
import type { ReviewSort } from "@/types";

const SORTS: { value: ReviewSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "best", label: "Best" },
  { value: "worst", label: "Worst" },
];

export function ReviewFilterForm({
  from,
  to,
  sort,
}: {
  from: string;
  to: string;
  sort: ReviewSort;
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        From
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        To
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Sort
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <Button variant="secondary" type="submit">
        Apply
      </Button>
    </form>
  );
}

export { SORTS };
