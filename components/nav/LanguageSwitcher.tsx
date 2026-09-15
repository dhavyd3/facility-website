"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/site.config";

/**
 * Switches locale while staying on the current page — next-intl's usePathname
 * returns the route without the locale prefix, so the same path can simply be
 * re-rendered under the other locale.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("nav");
  const active = (params?.locale as string) ?? locales[0];

  return (
    <div
      className="flex items-center"
      role="group"
      aria-label={t("language")}
    >
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              aria-hidden="true"
              className="mx-2 h-3 w-px bg-[var(--gold-rule)]"
            />
          )}
          <Link
            href={pathname}
            locale={locale}
            aria-current={locale === active ? "true" : undefined}
            className={
              locale === active
                ? "meta text-gold"
                : "meta text-muted hover:text-gold"
            }
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
