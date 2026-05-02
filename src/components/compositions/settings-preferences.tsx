import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  CURRENCY_LABEL,
  DATE_FORMAT_LABEL,
  TIME_FORMAT_LABEL,
  formatCurrency,
  formatDate,
  formatTime,
} from "#/lib/format";
import {
  DATE_FORMATS,
  SUPPORTED_CURRENCIES,
  TIME_FORMATS,
  type Currency,
  type DateFormat,
  type TimeFormat,
} from "#/stores/settings";

export type SettingsPreferencesProps = {
  currency: Currency;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  onCurrencyChange: (currency: Currency) => void;
  onDateFormatChange: (dateFormat: DateFormat) => void;
  onTimeFormatChange: (timeFormat: TimeFormat) => void;
};

const sampleDate = new Date("2026-12-31T14:30:00");

export function SettingsPreferences({
  currency,
  dateFormat,
  timeFormat,
  onCurrencyChange,
  onDateFormatChange,
  onTimeFormatChange,
}: SettingsPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize how values are displayed across the app.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="currency-select">Currency</FieldLabel>
          <Select value={currency} onValueChange={(value) => onCurrencyChange(value as Currency)}>
            <SelectTrigger id="currency-select" className="w-full sm:w-72">
              <SelectValue>
                {(value: unknown) => CURRENCY_LABEL[value as Currency] ?? "Select currency"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  {CURRENCY_LABEL[code]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Monetary values such as hourly rates and earnings will be formatted with this currency.
            Example: {formatCurrency(1234.5, currency)}.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="date-format-select">Date format</FieldLabel>
          <Select
            value={dateFormat}
            onValueChange={(value) => onDateFormatChange(value as DateFormat)}
          >
            <SelectTrigger id="date-format-select" className="w-full sm:w-72">
              <SelectValue>
                {(value: unknown) => DATE_FORMAT_LABEL[value as DateFormat] ?? "Select date format"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DATE_FORMATS.map((value) => (
                <SelectItem key={value} value={value}>
                  {DATE_FORMAT_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Today is {formatDate(sampleDate, dateFormat)} in this format.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="time-format-select">Time format</FieldLabel>
          <Select
            value={timeFormat}
            onValueChange={(value) => onTimeFormatChange(value as TimeFormat)}
          >
            <SelectTrigger id="time-format-select" className="w-full sm:w-72">
              <SelectValue>
                {(value: unknown) => TIME_FORMAT_LABEL[value as TimeFormat] ?? "Select time format"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TIME_FORMATS.map((value) => (
                <SelectItem key={value} value={value}>
                  {TIME_FORMAT_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Time of day will be shown as {formatTime(sampleDate, timeFormat)}.
          </FieldDescription>
        </Field>
      </CardContent>
    </Card>
  );
}
