import { format } from "date-fns";

type BookingInfoCardProps = {
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
};

export function BookingInfoCard({
  roomName,
  checkIn,
  checkOut,
  guests,
  guestName,
  guestEmail,
}: BookingInfoCardProps) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <p className="font-medium">{roomName}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {format(checkIn, "EEE, MMM d yyyy")} &rarr; {format(checkOut, "EEE, MMM d yyyy")}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {guests} guest{guests > 1 ? "s" : ""} &middot; {guestName} &middot; {guestEmail}
      </p>
    </div>
  );
}
