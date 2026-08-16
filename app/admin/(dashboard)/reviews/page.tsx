import { ReviewFilterForm, SORTS } from "@/components/admin/ReviewFilterForm";
import { ReviewListItem } from "@/components/admin/ReviewListItem";
import { listReviews } from "@/lib/reviews";
import { parseDateOnly } from "@/lib/dates";
import type { ReviewSort } from "@/types";

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

      <ReviewFilterForm from={params.from ?? ""} to={params.to ?? ""} sort={sort} />

      {reviews.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews in this range.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <ReviewListItem key={review.id} review={review} />
          ))}
        </ul>
      )}
    </div>
  );
}
