import { format } from "date-fns";
import { Button } from "@/components/Button";
import { listReviews, type ReviewSort } from "@/lib/reviews";
import { parseDateOnly } from "@/lib/dates";

const SORTS: { value: ReviewSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "best", label: "Best" },
  { value: "worst", label: "Worst" },
];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const from = parseDateOnly(params.from ?? null);
  const to = parseDateOnly(params.to ?? null);
  const sort: ReviewSort = SORTS.some((s) => s.value === params.sort) ? (params.sort as ReviewSort) : "latest";

  const reviews = await listReviews({ from, to, sort });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>

      <form method="get" className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          From
          <input
            type="date"
            name="from"
            defaultValue={params.from ?? ""}
            className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          To
          <input
            type="date"
            name="to"
            defaultValue={params.to ?? ""}
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

      {reviews.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews in this range.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-black/10 p-4 dark:border-white/15">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{review.rating} / 5</span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {review.booking.room.name} &middot; {format(review.createdAt, "MMM d yyyy")}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
