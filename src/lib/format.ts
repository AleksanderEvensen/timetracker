import { format } from "date-fns";

import {
  CURRENCY_LOCALE,
  type Currency,
  type DateFormat,
  type TimeFormat,
} from "#/stores/settings";

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
  }).format(amount);
}

const DATE_FORMAT_PATTERN: Record<DateFormat, string> = {
  mdy: "MM/dd/yyyy",
  dmy: "dd/MM/yyyy",
  ymd: "yyyy/MM/dd",
  dotted_dmy: "dd.MM.yyyy",
  dotted_mdy: "MM.dd.yyyy",
  dotted_ymd: "yyyy.MM.dd",
};

const TIME_FORMAT_PATTERN: Record<TimeFormat, string> = {
  "24": "HH:mm",
  "12": "h:mm a",
};

export function formatDate(
  date: Date | string,
  dateFormat: DateFormat,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, DATE_FORMAT_PATTERN[dateFormat]);
}

export function formatTime(date: Date, timeFormat: TimeFormat): string {
  return format(date, TIME_FORMAT_PATTERN[timeFormat]);
}

export const CURRENCY_LABEL: Record<Currency, string> = {
  USD: "US Dollar (USD)",
  NOK: "Norwegian Krone (NOK)",
  EUR: "Euro (EUR)",
};

export const DATE_FORMAT_LABEL: Record<DateFormat, string> = {
  mdy: "Month/Day/Year (12/31/2026)",
  dmy: "Day/Month/Year (31/12/2026)",
  ymd: "Year/Month/Day (2026/12/31)",
  dotted_mdy: "Month.Day.Year (12.31.2026)",
  dotted_dmy: "Day.Month.Year (31.12.2026)",
  dotted_ymd: "Year.Month.Day (2026.12.31)",
};

export const TIME_FORMAT_LABEL: Record<TimeFormat, string> = {
  "24": "24-hour (14:30)",
  "12": "12-hour (2:30 PM)",
};
