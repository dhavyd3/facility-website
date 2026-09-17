import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { site } from "@/site.config";
import { localeAlternates } from "@/lib/alternates";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Meta } from "@/components/ui/Meta";
import { Hero } from "@/components/editorial/Hero";
import { Section } from "@/components/editorial/Section";
import { Photo } from "@/components/editorial/Photo";
import { richTags } from "@/components/editorial/RichText";

/**
 * The About page, built from the client's brochure: who Facility is, its five
 * objectives, the two branches of what it does, its values, and a word from
 * the CEO.
 *
 * Both photographs are AI-generated from a character trained on the CEO's own
 * photos. The CEO should approve them, and the story written in her voice,
 * before this page goes live.
 */
const PHOTOS = {
  conversation: "/about/kathia-conversation.jpg",
  portrait: "/about/kathia-portrait.jpg",
} as const;

/** Each objective belongs to one of the two branches. */
const OBJECTIVES = [
  { n: "1", pole: "events" },
  { n: "2", pole: "events" },
  { n: "3", pole: "services" },
  { n: "4", pole: "services" },
  { n: "5", pole: "services" },
] as const;

const POLES = [
  {
    id: "events",
    index: "01",
    items: ["family", "wellbeing", "teenRetreats", "teenSpaces"],
  },
  {
    id: "services",
    index: "02",
    items: ["decoration", "cleaning", "rental", "purchasing"],
  },
] as const;

const CLIENTS = [
  "families",
  "parents",
  "teens",
  "individuals",
  "landlords",
  "companies",
  "organisations",
] as const;

const VALUES = ["responsibility", "integrity", "excellence", "service"] as const;
const ROMAN = ["I", "II", "III", "IV"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("metaTitle"),
    description: t("hero.vision"),
    alternates: localeAlternates("/a-propos", locale),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const s = await getTranslations("services");

  const facts = (["base", "poles", "contact", "clients"] as const).map(
    (key) => ({
      label: t(`facts.${key}.label`),
      value: t(`facts.${key}.value`),
    }),
  );

  return (
    <>
      <Hero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", {
          ...richTags,
          // Keeps "sommes-nous ?" whole: the hyphen and the space before "?"
          // are both break points, and either orphan looks like a mistake.
          nobr: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
        })}
        intro={t("hero.intro")}
        facts={facts}
        actions={
          <ButtonLink href="/contact" variant="solid">
            {t("hero.cta")}
          </ButtonLink>
        }
        media={
          <figure>
            <Photo src={PHOTOS.conversation} alt={t("hero.photoAlt")} priority />
            <figcaption className="mt-6 hairline-t pt-5">
              <Meta tone="muted">{t("hero.visionLabel")}</Meta>
              <p className="mt-2 font-display text-xl italic text-gold">
                {t("hero.vision")}
              </p>
            </figcaption>
          </figure>
        }
      />

      {/* ---------------------------- Objectives ---------------------------- */}
      <Section tone="champagne">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <header className="reveal lg:sticky lg:top-32 lg:self-start">
            <Meta tone="accent">{t("objectives.eyebrow")}</Meta>
            <h2 className="display display-lg mt-6">
              {t.rich("objectives.title", richTags)}
            </h2>
            <p className="prose-measure mt-7 text-lg text-muted">
              {t("objectives.intro")}
            </p>
          </header>

          <div>
            <ol>
              {OBJECTIVES.map(({ n, pole }, i) => (
                <li
                  key={n}
                  className="objective reveal"
                  style={{ "--d": `${i * 90}ms` } as CSSProperties}
                >
                  <span className="objective__no" aria-hidden="true">
                    0{n}
                  </span>
                  <div>
                    <p className="display objective__text">
                      {t(`objectives.items.${n}`)}
                    </p>
                    <Meta tone="muted" as="p" className="mt-3">
                      {t(`poles.${pole}.name`)}
                    </Meta>
                  </div>
                </li>
              ))}
            </ol>
            <p className="reveal mt-12 font-display text-2xl italic text-gold">
              {t("objectives.closing")}
            </p>
          </div>
        </div>
      </Section>

      {/* ----------------------------- Services ----------------------------- */}
      <Section
        eyebrow={t("poles.eyebrow")}
        title={t.rich("poles.title", richTags)}
      >
        <div className="poles mt-16">
          {POLES.map((pole) => (
            <article
              key={pole.id}
              className={`pole pole--${pole.id} reveal${pole.id === "events" ? " on-dark" : ""}`}
            >
              <Meta tone="accent">{pole.index}</Meta>
              <h3 className="display display-md mt-4">
                {t(`poles.${pole.id}.name`)}
              </h3>
              <p className="pole__tagline mt-3">
                {t(`poles.${pole.id}.tagline`)}
              </p>
              <ul className="mt-10">
                {pole.items.map((item, i) => (
                  <li
                    key={item}
                    className="spec-item"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <svg
                      className="spec-diamond"
                      width={12}
                      height={12}
                      aria-hidden="true"
                    >
                      <path d="M 6 1 L 11 6 L 6 11 L 1 6 Z" />
                    </svg>
                    <span>{t(`poles.${pole.id}.items.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="reveal mt-14 flex flex-col gap-4 hairline-t pt-8 md:flex-row md:items-baseline md:gap-10">
          <Meta tone="muted" className="shrink-0">
            {t("poles.clientsLabel")}
          </Meta>
          <ul className="clients">
            {CLIENTS.map((client) => (
              <li key={client}>{t(`poles.clients.${client}`)}</li>
            ))}
          </ul>
        </div>

        <div className="reveal mt-14 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl italic text-gold">
            {t("poles.closing")}
          </p>
          <ButtonLink href="/services" variant="solid">
            {s("learnMore")}
            <span aria-hidden="true" className="btn-arrow">
              &rarr;
            </span>
          </ButtonLink>
        </div>
      </Section>

      {/* ------------------------------ Values ------------------------------ */}
      <Section
        tone="dark"
        eyebrow={t("values.eyebrow")}
        title={t.rich("values.title", richTags)}
        intro={t("values.intro")}
      >
        <ol className="values mt-16">
          {VALUES.map((value, i) => (
            <li
              key={value}
              className="value reveal"
              style={{ "--d": `${i * 110}ms` } as CSSProperties}
            >
              <Meta tone="accent">{ROMAN[i]}</Meta>
              <h3 className="display value__name">
                {t(`values.items.${value}.name`)}
              </h3>
              <p className="value__body text-champagne/85">
                {t(`values.items.${value}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------ Founder ----------------------------- */}
      <section className="shell py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-20">
          <div className="reveal">
            <Photo
              src={PHOTOS.portrait}
              alt={t("founder.photoAlt")}
              curtain
            />
          </div>

          <div className="reveal">
            <Meta tone="accent">{t("founder.eyebrow")}</Meta>
            <h2 className="display founder__name mt-6">{site.founder.name}</h2>
            <p className="mt-3 font-display text-2xl italic text-gold">
              {t("founder.role")}
            </p>
            <span className="founder__rule" aria-hidden="true" />

            <blockquote className="founder__quote">
              <svg
                className="founder__mark"
                width={34}
                height={24}
                viewBox="0 0 34 24"
                aria-hidden="true"
              >
                <path d="M13 1C6 3.5 1 9 1 15.5 1 20 3.8 23 7.6 23c3.4 0 5.9-2.4 5.9-5.6 0-3.1-2.3-5.3-5.3-5.3-.7 0-1.2.1-1.6.3.9-3.8 3.6-7 7.6-9.2L13 1Zm19 0c-7 2.5-12 8-12 14.5 0 4.5 2.8 7.5 6.6 7.5 3.4 0 5.9-2.4 5.9-5.6 0-3.1-2.3-5.3-5.3-5.3-.7 0-1.2.1-1.6.3.9-3.8 3.6-7 7.6-9.2L32 1Z" />
              </svg>
              <p>{t("founder.quote")}</p>
            </blockquote>

            <div className="prose-measure mt-8 space-y-5 text-muted">
              <p>{t("founder.story1")}</p>
              <p>{t("founder.story2")}</p>
              <p>{t("founder.story3")}</p>
            </div>

            <p className="founder__signature mt-8">{t("founder.signature")}</p>

            <ArrowLink href="/contact" className="mt-10">
              {t("founder.cta")}
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
