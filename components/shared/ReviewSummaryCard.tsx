export function ReviewSummaryCard({
  title,
  rating,
  comment,
}: {
  title: string;
  rating: number;
  comment: string;
}) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm font-medium">{rating} / 5</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{comment}</p>
    </div>
  );
}
