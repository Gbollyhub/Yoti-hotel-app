import { Label, Radio, RadioGroup } from "@headlessui/react";
import { Button } from "@/components/Button";
import { ErrorBanner } from "@/components/ErrorBanner";

type ReviewFormProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  canSubmit: boolean;
};

export function ReviewForm({
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onSubmit,
  loading,
  error,
  canSubmit,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Leave a review</h2>
      {!canSubmit && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You can leave a review once your stay has ended.
        </p>
      )}
      {error && <ErrorBanner message={error} />}
      <RadioGroup value={rating} onChange={onRatingChange} disabled={!canSubmit} className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Radio
              key={n}
              value={n}
              className="cursor-pointer rounded-md border border-black/10 px-3 py-2 text-sm data-checked:border-foreground data-checked:bg-foreground data-checked:text-background data-disabled:cursor-not-allowed data-disabled:opacity-40 dark:border-white/15"
            >
              {n}
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Comment
        <textarea
          required={canSubmit}
          disabled={!canSubmit}
          rows={3}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="rounded-md border border-black/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-transparent"
        />
      </label>
      <Button variant="primary" type="submit" disabled={loading || !canSubmit}>
        Submit review
      </Button>
    </form>
  );
}
