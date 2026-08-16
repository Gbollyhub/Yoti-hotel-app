import { addDays, format } from "date-fns";
import { DinnerScheduleList } from "@/components/admin/DinnerScheduleList";
import { getDinnersForDate } from "@/lib/dinners";
import { today } from "@/lib/dates";

export default async function AdminDinnersPage() {
  const [todayDinners, tomorrowDinners] = await Promise.all([
    getDinnersForDate(today()),
    getDinnersForDate(addDays(today(), 1)),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dinners</h1>
      <DinnerScheduleList label={`Today, ${format(today(), "MMM d")}`} dinners={todayDinners} />
      <DinnerScheduleList label={`Tomorrow, ${format(addDays(today(), 1), "MMM d")}`} dinners={tomorrowDinners} />
    </div>
  );
}
