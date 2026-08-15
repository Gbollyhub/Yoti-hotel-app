import { getCurrentAdmin } from "@/lib/session";

export default async function AdminOverviewPage() {
  const admin = await getCurrentAdmin();
  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as {admin?.email}.
      </p>
    </div>
  );
}
