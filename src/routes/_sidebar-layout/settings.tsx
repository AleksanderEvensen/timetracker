import { createFileRoute } from "@tanstack/react-router";

import { SettingsPreferences } from "#/components/compositions/settings-preferences";
import { useSettingsStore } from "#/stores/settings";

export const Route = createFileRoute("/_sidebar-layout/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const currency = useSettingsStore((s) => s.currency);
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const timeFormat = useSettingsStore((s) => s.timeFormat);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const setDateFormat = useSettingsStore((s) => s.setDateFormat);
  const setTimeFormat = useSettingsStore((s) => s.setTimeFormat);

  return (
    <div className="flex flex-col gap-6 p-6">
      <SettingsPreferences
        currency={currency}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        onCurrencyChange={setCurrency}
        onDateFormatChange={setDateFormat}
        onTimeFormatChange={setTimeFormat}
      />
    </div>
  );
}
