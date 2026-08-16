import Link from "next/link";
import { getCurrentAdmin } from "@/lib/session";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Yoti Hotel admin
          </Link>
          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/bookings">Bookings</Link>
            <Link href="/admin/dinners">Dinners</Link>
            <Link href="/admin/reviews">Reviews</Link>
            <span className="text-zinc-500 dark:text-zinc-400">{admin?.email}</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
