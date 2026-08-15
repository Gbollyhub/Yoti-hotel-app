"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { CancelBookingButton } from "@/components/CancelBookingButton";

export function AdminCancelBookingAction({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <ErrorBanner message={error} />}
      <CancelBookingButton onConfirm={handleConfirm} loading={loading} />
    </div>
  );
}
