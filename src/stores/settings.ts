import { create } from "zustand";

export const SUPPORTED_CURRENCIES = ["USD", "NOK", "EUR"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: "en-US",
  NOK: "nb-NO",
  EUR: "de-DE",
};

export const DATE_FORMATS = [
  "mdy",
  "dmy",
  "ymd",
  "dotted_mdy",
  "dotted_dmy",
  "dotted_ymd",
] as const;
export type DateFormat = (typeof DATE_FORMATS)[number];

export const TIME_FORMATS = ["24", "12"] as const;
export type TimeFormat = (typeof TIME_FORMATS)[number];

type SettingsState = {
  currency: Currency;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  setCurrency: (currency: Currency) => void;
  setDateFormat: (dateFormat: DateFormat) => void;
  setTimeFormat: (timeFormat: TimeFormat) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  currency: "USD",
  dateFormat: "mdy",
  timeFormat: "24",
  setCurrency: (currency) => set({ currency }),
  setDateFormat: (dateFormat) => set({ dateFormat }),
  setTimeFormat: (timeFormat) => set({ timeFormat }),
}));
