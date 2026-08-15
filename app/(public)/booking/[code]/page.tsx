"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Label, Radio, RadioGroup, Switch } from "@headlessui/react";
import { Button } from "@/components/Button";
import { useBookingDetail } from "@/hooks/useBookingDetail";
import { useReview } from "@/hooks/useReview";
import { nightsBetween, today } from "@/lib/dates";

function dateKey(iso: string) {
  return iso.slice(0, 10);
}

export default function BookingDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { booking, loading, error, actionError, actionLoading, cancel, toggleDinner, refresh } =
    useBookingDetail(code);
  const review = useReview(code, refresh);

  if (loading) {
    return <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>;
  }
  if (error || !booking) {
    return <p className="text-zinc-600 dark:text-zinc-400">{error ?? "Booking not found"}</p>;
  }

  const nights = nightsBetween(new Date(booking.checkIn), new Date(booking.checkOut));
  const dinnerMap = new Map(booking.dinners.map((d) => [dateKey(d.date), d.hasDinner]));

  const hasEnded = new Date(booking.checkOut).getTime() <= today().getTime();
  const showReviewSection = booking.status === "CONFIRMED" && !booking.review;
  const canReview = showReviewSection && hasEnded;

  function handleCancel() {
    if (confirm("Cancel this booking? This can't be undone.")) {
      cancel();
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Booking {booking.confirmationCode}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {booking.status === "CANCELLED" ? "Cancelled" : "Confirmed"}
        </p>
      </div>

      {actionError && (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {actionError}
        </p>
      )}

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <p className="font-medium">{booking.room.name}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {format(new Date(booking.checkIn), "EEE, MMM d yyyy")} &rarr;{" "}
          {format(new Date(booking.checkOut), "EEE, MMM d yyyy")}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.guests} guest{booking.guests > 1 ? "s" : ""} &middot; {booking.guestName} &middot;{" "}
          {booking.guestEmail}
        </p>
      </div>

      {booking.status === "CONFIRMED" && (
        <Button variant="secondary" onClick={handleCancel} disabled={actionLoading}>
          Cancel booking
        </Button>
      )}

      {booking.status === "CONFIRMED" && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-medium">Dinner</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Let us know which nights you&apos;d like dinner at the hotel.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {nights.map((night) => {
              const key = dateKey(night.toISOString());
              const hasDinner = dinnerMap.get(key) ?? false;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md border border-black/10 px-4 py-3 dark:border-white/15"
                >
                  <span className="text-sm">{format(night, "EEE, MMM d yyyy")}</span>
                  <Switch
                    checked={hasDinner}
                    onChange={(checked) => toggleDinner(key, checked)}
                    disabled={actionLoading}
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition-colors data-checked:bg-foreground dark:bg-white/15"
                  >
                    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform group-data-checked:translate-x-6" />
                  </Switch>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {booking.review && (
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <h2 className="text-lg font-medium">Your review</h2>
          <p className="text-sm font-medium">{booking.review.rating} / 5</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{booking.review.comment}</p>
        </div>
      )}

      {showReviewSection && (
        <form onSubmit={review.submit} className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Leave a review</h2>
          {!hasEnded && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You can leave a review once your stay has ended.
            </p>
          )}
          {review.error && (
            <p className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {review.error}
            </p>
          )}
          <RadioGroup
            value={review.rating}
            onChange={review.setRating}
            disabled={!hasEnded}
            className="flex flex-col gap-1"
          >
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
              required={hasEnded}
              disabled={!hasEnded}
              rows={3}
              value={review.comment}
              onChange={(e) => review.setComment(e.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <Button variant="primary" type="submit" disabled={review.loading || !canReview}>
            Submit review
          </Button>
        </form>
      )}
    </div>
  );
}
