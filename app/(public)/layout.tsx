import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Yoti Hotel
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/book">Book a room</Link>
            <Link href="/booking/manage">Manage my booking</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-black/10 px-6 py-6 text-center text-xs text-zinc-500 dark:border-white/10">
        Yoti Hotel &mdash; 3 rooms, on the harbor.
      </footer>
    </div>
  );
}
