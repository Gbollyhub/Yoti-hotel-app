"use client";

import { useState } from "react";

export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNightCents: number;
  capacity: number;
};

export type BookingStep = "dates" | "rooms" | "details" | "confirmed";

export function useBooking() {
  const [step, setStep] = useState<BookingStep>("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitDates(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setRooms(data.rooms);
      setStep("rooms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectRoom(room: Room) {
    setSelectedRoom(room);
    setGuests(1);
    setError(null);
    setStep("details");
  }

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoom) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          guests,
          guestName,
          guestEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setConfirmationCode(data.confirmationCode);
      setStep("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return {
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
    backToDates: () => setStep("dates"),
    backToRooms: () => setStep("rooms"),
  };
}
