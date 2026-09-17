import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { services } from "@/lib/services";
import { localeAlternates } from "@/lib/alternates";
import { ButtonLink } from "@/components/ui/Button";
import { Meta } from "@/components/ui/Meta";
import { Section } from "@/components/editorial/Section";
import { richTags } from "@/components/editorial/RichText";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";

/**
 * Without JS nothing can expand, so the showcase falls back to the stacked
 * layout with every panel open — the same approach as the About page. Scoped to
 * this page rather than the layout's noscript block, which is global.
 */
const NOSCRIPT = `
.svc-row{flex-direction:column !important;height:auto !important}
.svc-panel{flex:1 1 auto !important}
.svc-panel__trigger{display:none !important}
.svc-panel__veil{display:none !important}
.svc-panel__figure{position:relative !important;left:auto !important;width:100% !important;
aspect-ratio:4/3;transform:none !important;filter:none !important}
.svc-panel__face{position:relative !important;opacity:1 !important;visibility:visible !important;
height:auto !important}
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  return {
    title: t("eyebrow"),
    description: t("intro"),
    alternates: localeAlternates("/services", locale),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");

  const cards = services.map((service) => ({
    id: service.id,
    slug: service.slug,
    index: service.index,
    name: t(`${service.id}.name`),
    short: t(`${service.id}.short`),
    objective: t(`${service.id}.objective`),
    image: `/services/${service.id}.jpg`,
  }));

  return (
    <>
      <noscript>
        <style>{NOSCRIPT}</style>
      </noscript>

      <section className="shell pt-16 pb-12 md:pt-24">
        <div className="reveal max-w-4xl">
          <Meta tone="accent">{t("eyebrow")}</Meta>
          <h1 className="display display-xl mt-7">
            {t.rich("title", richTags)}
          </h1>
          <p className="prose-measure mt-8 text-lg text-muted">{t("intro")}</p>
        </div>
      </section>

      <section className="shell pb-24 md:pb-32">
        <div className="reveal">
          <ServiceShowcase services={cards} learnMore={t("learnMore")} />
        </div>
      </section>

      <Section tone="dark">
        <div className="reveal max-w-3xl">
          <h2 className="display display-lg">
            {t.rich("closing.title", richTags)}
          </h2>
          <p className="prose-measure mt-7 text-lg text-champagne/85">
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
