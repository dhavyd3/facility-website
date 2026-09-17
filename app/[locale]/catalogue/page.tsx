import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { services } from "@/lib/services";
import { localeAlternates } from "@/lib/alternates";
import { ButtonLink } from "@/components/ui/Button";
import { Meta, RailNumber } from "@/components/ui/Meta";
import { Section } from "@/components/editorial/Section";
import { Sparkle } from "@/components/editorial/Sparkle";
import { richTags } from "@/components/editorial/RichText";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogue" });

  return {
    title: t("metaTitle"),
    description: t("intro"),
    alternates: localeAlternates("/catalogue", locale),
  };
}

/**
 * The catalogue of past work, before there is any. Rather than an apologetic
 * empty state, the page is an exhibition that hasn't opened: one frame waiting
 * for the first project, and a wall with a frame reserved for each service.
 *
 * When real projects exist, each service frame becomes a project card and the
 * hero frame gives way to the latest one.
 */
export default async function CataloguePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("catalogue");
  const s = await getTranslations("services");

  return (
    <>
      <section className="shell pt-16 pb-20 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="reveal">
            <Meta tone="accent">{t("eyebrow")}</Meta>
            <h1 className="display display-xl mt-7">
              {t.rich("title", richTags)}
            </h1>
            <p className="prose-measure mt-8 text-lg text-muted">
              {t("intro")}
            </p>
          </div>

          <div className="reveal">
            <div className="empty-frame ruled-columns" aria-hidden="true">
              <svg className="empty-frame__dash">
                <rect className="frame-dash" width="100%" height="100%" />
              </svg>
              <span className="empty-frame__no">
                <RailNumber>01</RailNumber>
              </span>
              <div className="empty-frame__center">
                <svg className="empty-frame__diamond" width={72} height={72}>
                  <path d="M 36 10 L 62 36 L 36 62 L 10 36 Z" />
                </svg>
                <Sparkle size={22} className="empty-frame__spark empty-frame__spark--1" />
                <Sparkle size={14} className="empty-frame__spark empty-frame__spark--2" />
                <Sparkle size={11} className="empty-frame__spark empty-frame__spark--3" />
              </div>
            </div>

            {/* The museum wall label beside a work, for a work still to come. */}
            <div className="mt-6 flex items-baseline justify-between gap-6 hairline-t pt-5">
              <div>
                <p className="display text-2xl">{t("placardTitle")}</p>
                <p className="mt-1 font-display text-lg italic text-gold">
                  {t("placardCaption")}
                </p>
              </div>
              <Meta tone="muted">{t("placardNumber")}</Meta>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow={t("wallEyebrow")}
        title={t.rich("wallTitle", richTags)}
      >
        <ul className="gallery mt-16">
          {services.map((service, i) => (
            <li
              key={service.id}
              className="gallery__item reveal"
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
            >
              <div className="gallery__frame ruled-columns" aria-hidden="true">
                <span className="gallery__mat" />
                <span className="gallery__no">
                  <RailNumber>{service.index}</RailNumber>
                </span>
                <svg className="gallery__diamond" width={28} height={28}>
                  <path d="M 14 4 L 24 14 L 14 24 L 4 14 Z" />
                </svg>
              </div>
              <h3 className="display mt-5 text-[1.625rem] leading-tight">
                {s(`${service.id}.name`)}
              </h3>
              <Meta tone="muted" as="p" className="mt-3">
                {t("awaiting")}
              </Meta>
            </li>
          ))}

          <li
            className="gallery__item reveal"
            style={{ "--d": `${services.length * 90}ms` } as CSSProperties}
          >
            <div className="gallery__frame gallery__frame--yours">
              <svg className="gallery__dash" aria-hidden="true">
                <rect className="frame-dash" width="100%" height="100%" />
              </svg>
              <div className="gallery__yours">
                <Meta tone="accent">{t("yoursLabel")}</Meta>
                <h3 className="display mt-4 text-3xl">
                  {t.rich("yoursTitle", richTags)}
                </h3>
                <p className="mt-4 text-muted">{t("yoursBody")}</p>
                <ButtonLink href="/contact" variant="solid" className="mt-8">
                  {t("yoursCta")}
                </ButtonLink>
              </div>
            </div>
          </li>
        </ul>
      </Section>
    </>
  );
}
