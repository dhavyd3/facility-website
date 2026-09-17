import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { site } from "@/site.config";
import { SUBJECTS } from "@/lib/contact";
import { localeAlternates } from "@/lib/alternates";
import { Meta } from "@/components/ui/Meta";
import { richTags } from "@/components/editorial/RichText";
import { Sparkle } from "@/components/editorial/Sparkle";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/contact/CopyButton";

/** Same rule as the footer: a value still marked TODO is never printed. */
const real = (value: string) =>
  value && !value.startsWith("TODO") ? value : null;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("metaTitle"),
    description: t("intro"),
    alternates: localeAlternates("/contact", locale),
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  // /contact?service=events arrives with that subject already chosen.
  const { service } = await searchParams;
  const initialSubject =
    typeof service === "string" && SUBJECTS.includes(service) ? service : "";

  const address =
    [site.addressLine, site.city, site.country]
      .map(real)
      .filter(Boolean)
      .join(", ") || null;
  const phone = real(site.phone);
  const email = real(site.email);

  const rows: {
    key: string;
    label: string;
    icon: ReactNode;
    value: string | null;
    href?: string;
    action?: ReactNode;
  }[] = [
    {
      key: "location",
      label: t("location"),
      icon: <PinIcon />,
      value: address,
      action: address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="meta link-underline"
        >
          {t("directions")}
        </a>
      ),
    },
    {
      key: "phone",
      label: t("phone"),
      icon: <PhoneIcon />,
      value: phone,
      href: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined,
      action: phone && (
        <CopyButton value={phone} label={t("copy")} copiedLabel={t("copied")} />
      ),
    },
    {
      key: "email",
      label: t("email"),
      icon: <MailIcon />,
      value: email,
      href: email ? `mailto:${email}` : undefined,
      action: email && (
        <CopyButton value={email} label={t("copy")} copiedLabel={t("copied")} />
      ),
    },
  ];

  return (
    <>
      <section className="shell pt-16 pb-16 md:pt-24">
        <div className="reveal max-w-4xl">
          <Meta tone="accent">{t("eyebrow")}</Meta>
          <h1 className="display display-xl mt-7">
            {t.rich("title", richTags)}
          </h1>
          <p className="prose-measure mt-8 text-lg text-muted">{t("intro")}</p>
        </div>
      </section>

      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-14 hairline-t pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="reveal">
            <aside
              className="contact-card on-dark lg:sticky lg:top-32"
              aria-labelledby="contact-details-label"
            >
              <Sparkle size={20} className="contact-card__spark" />
              <h2 id="contact-details-label" className="meta" data-tone="accent">
                {t("detailsLabel")}
              </h2>

              <dl className="mt-8">
                {rows.map((row) => (
                  <div key={row.key} className="contact-card__row">
                    <dt className="flex items-center gap-3">
                      {row.icon}
                      <Meta tone="muted">{row.label}</Meta>
                    </dt>
                    <dd className="mt-3">
                      {row.value === null ? (
                        <span className="contact-card__value contact-card__value--pending">
                          {t("pending")}
                        </span>
                      ) : row.href ? (
                        <a href={row.href} className="contact-card__value">
                          {row.value}
                        </a>
                      ) : (
                        <span className="contact-card__value">{row.value}</span>
                      )}
                      {row.action && <div className="mt-3">{row.action}</div>}
                    </dd>
                  </div>
                ))}
              </dl>

              <dl className="contact-card__facts">
                <div>
                  <dt>
                    <Meta tone="muted">{t("replyLabel")}</Meta>
                  </dt>
                  <dd className="display mt-2 text-2xl">{t("replyValue")}</dd>
                </div>
                <div>
                  <dt>
                    <Meta tone="muted">{t("commitmentLabel")}</Meta>
                  </dt>
                  <dd className="display mt-2 text-2xl">
                    {t("commitmentValue")}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>

          <div className="reveal">
            <h2 className="meta" data-tone="accent">
              {t("formLabel")}
            </h2>
            <div className="mt-10">
              <ContactForm initialSubject={initialSubject} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PinIcon() {
  return (
    <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
