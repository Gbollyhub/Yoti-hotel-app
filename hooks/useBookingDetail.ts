"use client";

import { useEffect, useState } from "react";
import type { BookingDetail } from "@/types";

export function useBookingDetail(code: string) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const loading = booking === null && error === null;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/bookings/${code}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Something went wrong");
        if (!cancelled) setBooking(data.booking);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [code, refreshIndex]);

  async function runAction(request: () => Promise<Response>) {
    setActionError(null);
    setActionLoading(true);
    try {
      const res = await request();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setRefreshIndex((n) => n + 1);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setActionLoading(false);
    }
  }

  function cancel() {
    return runAction(() =>
      fetch(`/api/bookings/${code}`, { method: "DELETE" }),
    );
  }

  function toggleDinner(date: string, hasDinner: boolean) {
    return runAction(() =>
      fetch(`/api/bookings/${code}/dinners`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nights: [{ date, hasDinner }] }),
      }),
    );
  }

  function refresh() {
    setRefreshIndex((n) => n + 1);
  }

  return {
    booking,
    loading,
    error,
    actionError,
    actionLoading,
    cancel,
    toggleDinner,
    refresh,
  };
}
