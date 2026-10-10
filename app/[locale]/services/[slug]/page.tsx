import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { services, serviceBySlug } from "@/lib/services";
import { localeAlternates } from "@/lib/alternates";
import { ButtonLink } from "@/components/ui/Button";
import { Meta, RailNumber } from "@/components/ui/Meta";
import { Hero } from "@/components/editorial/Hero";
import { Photo } from "@/components/editorial/Photo";
import { Section } from "@/components/editorial/Section";
import { richTags } from "@/components/editorial/RichText";

/**
 * One page per service, from one template.
 *
 * The lists (what it includes, the types, the four steps) are read straight off
 * the messages rather than pulled key by key with t(), so a service can gain or
 * lose an item in translation without this file knowing how many there are.
 */
type Detail = {
  photoAlt: string;
  facts: Record<string, { label: string; value: string }>;
  typesLabel: string;
  types: Record<string, string>;
  includes: Record<string, string>;
  process: Record<string, { title: string; body: string }>;
  note: string;
};

async function getDetail(id: string): Promise<Detail> {
  const messages = (await getMessages()) as unknown as {
    services: Record<string, { detail: Detail }>;
  };
  return messages.services[id].detail;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "services" });

  return {
    title: t(`${service.id}.name`),
    description: t(`${service.id}.objective`),
    alternates: localeAlternates(`/services/${slug}`, locale),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = serviceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const f = await getTranslations("forms");
  const id = service.id;
  const detail = await getDetail(id);

  const others = services.filter((other) => other.id !== id);

  return (
    <>
      <Hero
        eyebrow={t(`${id}.name`)}
        title={t.rich(`${id}.title`, richTags)}
        intro={t(`${id}.body`)}
        facts={Object.values(detail.facts)}
        actions={
          <ButtonLink href={`/contact?service=${id}`} variant="solid">
            {t(`${id}.cta`)}
          </ButtonLink>
        }
        media={
          <Photo
            src={`/services/${id}.jpg`}
            alt={detail.photoAlt}
            aspect="wide"
            priority
          />
        }
      />

      {/* ----------------------- What it includes ----------------------- */}
      {/* The objective is the brochure's own sentence, and some run long, so
          it is set a size below the usual section heading. */}
      <Section tone="champagne" eyebrow={t("includesLabel")}>
        <h2 className="display display-md reveal mt-6 max-w-4xl">
          {t(`${id}.objective`)}
        </h2>
        <ul className="spec-list mt-14">
          {Object.entries(detail.includes).map(([key, item]) => (
            <li key={key} className="spec-item">
              <svg
                className="spec-diamond"
                width={12}
                height={12}
                aria-hidden="true"
              >
                <path d="M 6 1 L 11 6 L 6 11 L 1 6 Z" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="reveal mt-14 max-w-3xl hairline-t pt-8">
          <Meta tone="muted">{t("noteLabel")}</Meta>
          <p className="mt-3 text-lg">{detail.note}</p>
        </div>
      </Section>

      {/* --------------------------- The types -------------------------- */}
      <Section eyebrow={detail.typesLabel}>
        <ul className="type-list">
          {Object.entries(detail.types).map(([key, item]) => (
            <li key={key} className="type-line reveal">
              <span className="display">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------- How it works ------------------------ */}
      <Section tone="dark" eyebrow={t("processLabel")}>
        <ol className="mt-14 max-w-4xl">
          {Object.entries(detail.process).map(([key, step], i) => (
            <li
              key={key}
              className="objective reveal"
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
            >
              <span className="objective__no" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <p className="display objective__text">{step.title}</p>
                <p className="mt-3 text-champagne/85">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------ Audience and CTA ---------------------- */}
      <Section>
        <div className="reveal grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Meta tone="muted">{t("audienceLabel")}</Meta>
            <p className="display display-md mt-4">{t(`${id}.audience`)}</p>
            <p className="prose-measure mt-6 text-muted">{f("quoteNote")}</p>
          </div>
          <ButtonLink href={`/contact?service=${id}`} variant="solid">
            {t(`${id}.cta`)}
          </ButtonLink>
        </div>
      </Section>

      {/* ------------------------- Other services ----------------------- */}
      <Section tone="champagne" eyebrow={t("othersLabel")}>
        <ul className="mt-12 grid gap-x-12 gap-y-4 md:grid-cols-2">
          {others.map((other) => (
            <li key={other.id} className="reveal hairline-t">
              <Link
                href={`/services/${other.slug}`}
                className="group flex items-baseline gap-5 py-5"
              >
                <RailNumber>{other.index}</RailNumber>
                <span className="display flex-1 text-2xl">
                  <span className="link-underline">{t(`${other.id}.name`)}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-gold transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-forest"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
