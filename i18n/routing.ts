import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/site.config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // French is the primary market, so it gets clean unprefixed URLs
  // (/services/evenements) and English is prefixed (/en/services/evenements).
  localePrefix: "as-needed",
  // A French company's bare "/" should be French. Without this, a visitor with
  // an English browser gets redirected to /en before seeing the French site.
  // Language is the visitor's explicit choice, via the FR/EN switcher.
  localeDetection: false,
});
