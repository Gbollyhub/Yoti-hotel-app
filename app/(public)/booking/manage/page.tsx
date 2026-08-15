"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function ManageBookingPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/booking/${trimmed}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Manage my booking</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Enter the confirmation code you received when you booked.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          required
          placeholder="e.g. AB12CD34"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-md border border-black/10 px-3 py-2 font-mono uppercase tracking-widest dark:border-white/15 dark:bg-transparent"
        />
        <Button variant="primary" type="submit">
          Find booking
        </Button>
      </form>
    </div>
  );
}
