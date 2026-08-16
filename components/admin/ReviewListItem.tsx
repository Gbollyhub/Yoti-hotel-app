import { format } from "date-fns";
import type { ReviewListItem as ReviewListItemType } from "@/lib/reviews";

export function ReviewListItem({ review }: { review: ReviewListItemType }) {
  return (
    <li className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{review.rating} / 5</span>
        <span className="text-zinc-600 dark:text-zinc-400">
          {review.booking.room.name} &middot; {format(review.createdAt, "MMM d yyyy")}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
    </li>
  );
}
