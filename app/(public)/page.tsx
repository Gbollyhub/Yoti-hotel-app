import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Welcome to Yoti Hotel</h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Three rooms on the harbor. Book a stay, or look up a booking you already made.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="primary" href="/book">
          Book a room
        </Button>
        <Button variant="secondary" href="/booking/manage">
          Manage my booking
        </Button>
      </div>
    </div>
  );
}
