import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { site } from "@/site.config";
import { Meta } from "@/components/ui/Meta";
import { Logo } from "./Logo";

/**
 * Contact facts come from site.config.ts. Anything still marked TODO there is
 * withheld rather than printed, so a placeholder can never reach a visitor.
 */
const isPlaceholder = (value: string) => value.startsWith("TODO");

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const s = await getTranslations("services");
  const year = new Date().getFullYear();

  const contact = [
    { label: nav("contact"), value: site.phone },
    { label: "Email", value: site.email },
    { label: "Adresse", value: site.addressLine },
  ].filter((row) => !isPlaceholder(row.value));

  return (
    <footer className="on-dark">
      <div className="shell grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo theme="dark" size="footer" />
          <p className="display display-md mt-8 max-w-[18ch] text-champagne">
            {t("tagline")}
          </p>
        </div>

        <div>
          <Meta tone="accent">{t("servicesLabel")}</Meta>
          <ul className="mt-6 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm text-champagne/85 transition-colors hover:text-gold-on-dark"
                >
                  {s(`${service.id}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Meta tone="accent">{t("companyLabel")}</Meta>
          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="/a-propos"
                className="text-sm text-champagne/85 transition-colors hover:text-gold-on-dark"
              >
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-champagne/85 transition-colors hover:text-gold-on-dark"
              >
                {nav("contact")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-champagne/85 transition-colors hover:text-gold-on-dark"
              >
                {nav("quote")}
              </Link>
            </li>
          </ul>

          {contact.length > 0 && (
            <ul className="mt-8 space-y-2">
              {contact.map((row) => (
                <li key={row.label} className="text-sm text-champagne/85">
                  {row.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-[var(--gold-rule)]/30 py-8">
        <Meta tone="muted">
          &copy; {year} {site.name}. {t("rights")}
        </Meta>
        <Meta tone="muted">{t("quoteOnly")}</Meta>
      </div>
    </footer>
  );
}
