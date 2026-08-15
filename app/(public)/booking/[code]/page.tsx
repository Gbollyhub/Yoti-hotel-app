"use client";

import { useParams } from "next/navigation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { BookingInfoCard } from "@/components/BookingInfoCard";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { DinnerToggleList } from "@/components/DinnerToggleList";
import { ReviewSummaryCard } from "@/components/ReviewSummaryCard";
import { ReviewForm } from "@/components/ReviewForm";
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

  const dinnerMap = new Map(booking.dinners.map((d) => [dateKey(d.date), d.hasDinner]));
  const nights = nightsBetween(new Date(booking.checkIn), new Date(booking.checkOut)).map((date) => {
    const key = dateKey(date.toISOString());
    return { key, date, hasDinner: dinnerMap.get(key) ?? false };
  });

  const hasEnded = new Date(booking.checkOut).getTime() <= today().getTime();
  const showReviewSection = booking.status === "CONFIRMED" && !booking.review;
  const canReview = showReviewSection && hasEnded;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Booking {booking.confirmationCode}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {booking.status === "CANCELLED" ? "Cancelled" : "Confirmed"}
        </p>
      </div>

      {actionError && <ErrorBanner message={actionError} />}

      <BookingInfoCard
        roomName={booking.room.name}
        checkIn={new Date(booking.checkIn)}
        checkOut={new Date(booking.checkOut)}
        guests={booking.guests}
        guestName={booking.guestName}
        guestEmail={booking.guestEmail}
      />

      {booking.status === "CONFIRMED" && <CancelBookingButton onConfirm={cancel} loading={actionLoading} />}

      {booking.status === "CONFIRMED" && (
        <DinnerToggleList nights={nights} disabled={actionLoading} onToggle={toggleDinner} />
      )}

      {booking.review && <ReviewSummaryCard title="Your review" {...booking.review} />}

      {showReviewSection && (
        <ReviewForm
          rating={review.rating}
          onRatingChange={review.setRating}
          comment={review.comment}
          onCommentChange={review.setComment}
          onSubmit={review.submit}
          loading={review.loading}
          error={review.error}
          canSubmit={canReview}
        />
      )}
    </div>
  );
}
