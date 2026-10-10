import { getTranslations, setRequestLocale } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import { Meta } from "@/components/ui/Meta";
import { Hero } from "@/components/editorial/Hero";
import { Section } from "@/components/editorial/Section";
import { ServiceRail } from "@/components/editorial/ServiceRail";
import { richTags } from "@/components/editorial/RichText";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const b = await getTranslations("brand");

  const facts = (["services", "contact", "quote", "commitment"] as const).map(
    (key) => ({
      label: t(`facts.${key}.label`),
      value: t(`facts.${key}.value`),
    }),
  );

  const values = (
    ["responsibility", "integrity", "excellence", "service"] as const
  ).map((key) => t(`values.${key}`));

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t.rich("title", richTags)}
        intro={`${b("tagline")} ${b("promise")}`}
        facts={facts}
        actions={
          <>
            <ButtonLink href="/contact" variant="solid">
              {t("cta")}
            </ButtonLink>
            <ButtonLink href="/services" variant="quiet">
              {t("ctaSecondary")}
            </ButtonLink>
          </>
        }
      />

      <Section
        eyebrow={t("railEyebrow")}
        title={t.rich("railTitle", richTags)}
        id="services"
      >
        <ServiceRail />
      </Section>

      <Section tone="dark">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal">
            <Meta tone="accent">{t("mission.eyebrow")}</Meta>
            <h2 className="display display-lg mt-6">
              {t.rich("mission.title", richTags)}
            </h2>
            <div className="mt-12 border-t border-[var(--gold-rule)]/30 pt-8">
              <Meta tone="accent">{t("mission.missionLabel")}</Meta>
              <p className="prose-measure mt-4 text-lg text-champagne/85">
                {b("mission")}
              </p>
            </div>
          </div>

          <div className="reveal lg:pt-4">
            <Meta tone="accent">{t("mission.valuesLabel")}</Meta>
            <ul className="mt-8">
              {values.map((value) => (
                <li
                  key={value}
                  className="display display-md border-t border-[var(--gold-rule)]/30 py-5"
                >
                  {value}
                </li>
              ))}
            </ul>
            <p className="border-t border-[var(--gold-rule)]/30 pt-6 text-champagne/85">
              {b("values")}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="reveal max-w-3xl">
          <h2 className="display display-lg">
            {t.rich("closing.title", richTags)}
          </h2>
          <p className="prose-measure mt-7 text-lg text-muted">
            {t("closing.body")}
          </p>
          <div className="mt-10">
            <ButtonLink href="/contact" variant="outline">
              {t("closing.cta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
