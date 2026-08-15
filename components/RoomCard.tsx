import { Button } from "@/components/Button";
import type { Room } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function RoomCard({ room, onSelect }: { room: Room; onSelect: (room: Room) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div>
        <p className="font-medium">{room.name}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{room.description}</p>
        <p className="mt-1 text-sm">
          {formatPrice(room.pricePerNightCents)}/night &middot; fits {room.capacity} guest
          {room.capacity > 1 ? "s" : ""}
        </p>
      </div>
      <Button variant="secondary" onClick={() => onSelect(room)} className="shrink-0">
        Select
      </Button>
    </div>
  );
}
