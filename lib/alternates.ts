import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { locales } from "@/site.config";

/**
 * Canonical and hreflang URLs for one page. French is unprefixed (as-needed)
 * and every other locale carries its prefix.
 *
 * Every page needs its own: without this a page inherits the layout's
 * canonical "/", which tells search engines it is a copy of the home page.
 */
export function localeAlternates(
  path: string,
  locale: string,
): Metadata["alternates"] {
  const pathFor = (l: string) =>
    l === routing.defaultLocale ? path : `/${l}${path}`;

  return {
    canonical: pathFor(locale),
    languages: Object.fromEntries(locales.map((l) => [l, pathFor(l)])),
  };
}
