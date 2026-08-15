"use client";

import { Label, Radio, RadioGroup } from "@headlessui/react";
import { Button } from "@/components/Button";
import { useBooking, type Room } from "@/hooks/useBooking";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookPage() {
  const {
    step,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    rooms,
    selectedRoom,
    guests,
    setGuests,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    confirmationCode,
    error,
    loading,
    submitDates,
    selectRoom,
    submitDetails,
    backToDates,
    backToRooms,
  } = useBooking();

  if (step === "confirmed") {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Booking confirmed!</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Save this confirmation code, you will need it to manage your booking.
        </p>
        <p className="rounded-lg border border-black/10 bg-black/[.03] px-6 py-4 font-mono text-2xl tracking-widest dark:border-white/15 dark:bg-white/[.06]">
          {confirmationCode}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {selectedRoom?.name}, {checkIn} - {checkOut}, {guests}{" "}
          guest{guests > 1 ? "s" : ""}
        </p>
        <Button variant="primary" href="/booking/manage">
          Manage this booking
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">Book a room</h1>

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {step === "dates" && (
        <form onSubmit={submitDates} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Check-in
            <input
              type="date"
              required
              min={todayString()}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Check-out
            <input
              type="date"
              required
              min={checkIn || todayString()}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <Button variant="primary" type="submit" disabled={loading} className="mt-2">
            {loading ? "Checking availability…" : "Check availability"}
          </Button>
        </form>
      )}

      {step === "rooms" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              {checkIn} - {checkOut}
            </span>
            <button
              type="button"
              onClick={backToDates}
              className="font-medium underline underline-offset-2"
            >
              Change dates
            </button>
          </div>
          {rooms.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              No rooms are available for those dates. Try a different range.
            </p>
          ) : (
            rooms.map((room: Room) => (
              <div
                key={room.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15"
              >
                <div>
                  <p className="font-medium">{room.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {room.description}
                  </p>
                  <p className="mt-1 text-sm">
                    {formatPrice(room.pricePerNightCents)}/night - fits{" "}
                    {room.capacity} guest{room.capacity > 1 ? "s" : ""}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => selectRoom(room)} className="shrink-0">
                  Select
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {step === "details" && selectedRoom && (
        <form onSubmit={submitDetails} className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              {selectedRoom.name}, {checkIn} - {checkOut}
            </span>
            <button
              type="button"
              onClick={backToRooms}
              className="font-medium underline underline-offset-2"
            >
              Change room
            </button>
          </div>

          <RadioGroup value={guests} onChange={setGuests} className="flex flex-col gap-1">
            <Label className="text-sm font-medium">Guests</Label>
            <div className="flex gap-2">
              {Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map((n) => (
                <Radio
                  key={n}
                  value={n}
                  className="cursor-pointer rounded-md border border-black/10 px-4 py-2 text-sm data-checked:border-foreground data-checked:bg-foreground data-checked:text-background dark:border-white/15"
                >
                  {n}
                </Radio>
              ))}
            </div>
          </RadioGroup>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Name
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <Button variant="primary" type="submit" disabled={loading} className="mt-2">
            {loading ? "Booking…" : "Confirm booking"}
          </Button>
        </form>
      )}
    </div>
  );
}
