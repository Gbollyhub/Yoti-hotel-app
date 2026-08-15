import Link from "next/link";

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
        <Link
          href="/book"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Book a room
        </Link>
        <Link
          href="/booking/manage"
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          Manage my booking
        </Link>
      </div>
    </div>
  );
}
