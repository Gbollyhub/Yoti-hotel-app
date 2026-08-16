import { format } from "date-fns";
import { Switch } from "@headlessui/react";

export type DinnerNight = {
  key: string;
  date: Date;
  hasDinner: boolean;
};

export function DinnerToggleList({
  nights,
  disabled,
  onToggle,
}: {
  nights: DinnerNight[];
  disabled: boolean;
  onToggle: (key: string, hasDinner: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-medium">Dinner</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Let us know which nights you&apos;d like dinner at the hotel.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {nights.map((night) => (
          <div
            key={night.key}
            className="flex items-center justify-between rounded-md border border-black/10 px-4 py-3 dark:border-white/15"
          >
            <span className="text-sm">{format(night.date, "EEE, MMM d yyyy")}</span>
            <Switch
              checked={night.hasDinner}
              onChange={(checked) => onToggle(night.key, checked)}
              disabled={disabled}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition-colors data-checked:bg-foreground dark:bg-white/15"
            >
              <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform group-data-checked:translate-x-6" />
            </Switch>
          </div>
        ))}
      </div>
    </div>
  );
}
