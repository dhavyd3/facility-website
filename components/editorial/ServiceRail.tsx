import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { Meta, RailNumber } from "@/components/ui/Meta";
import {
  RailConnector,
  RailDiamond,
  RailLine,
  RailTerminal,
} from "./RailMarks";
import { RailProgress } from "./RailProgress";

/**
 * The 01-05 rail. Five unrelated service lines are the hardest thing about
 * this brand, and a numbered editorial staircase is the device that makes them
 * read as one considered offering rather than a directory of odd jobs.
 *
 * Each row is tall enough (65vh from md up) to give the dash-dot line real
 * scroll distance to travel, which is what makes the animation legible — at
 * the compact row heights this list started with, the effect barely registered.
 *
 * Rows carry no border, fill or accent of their own; the rail lives in a
 * reserved gutter beside them (see globals.css for why that matters to Rule 1).
 */
export async function ServiceRail() {
  const t = await getTranslations("services");
  const last = services.length - 1;

  return (
    <>
      <RailProgress />
      <ol className="mt-16">
        {services.map((service, i) => {
          const isLast = i === last;

          return (
            <li
              key={service.id}
              className="rail__row"
              style={{ "--i": i } as CSSProperties}
              data-rail-row
              data-state="reached"
            >
              {i > 0 && <RailConnector />}
              {isLast ? <RailTerminal /> : <RailDiamond />}
              {!isLast && <RailLine />}

              <Link
                href={`/services/${service.slug}`}
                className="group block max-w-2xl pb-20"
              >
                <span className="flex items-baseline gap-4">
                  <RailNumber>{service.index}</RailNumber>
                  <Meta tone="muted">{t(`${service.id}.short`)}</Meta>
                </span>

                <h3 className="display display-lg mt-5">
                  {t(`${service.id}.name`)}
                </h3>

                <p className="mt-6 text-lg text-muted">
                  {t(`${service.id}.objective`)}
                </p>

                <p className="prose-measure mt-5 text-muted/90">
                  {t(`${service.id}.body`)}
                </p>

                <span className="meta mt-8 inline-flex items-center gap-2">
                  <span className="link-underline">{t("learnMore")}</span>
                  <span
                    aria-hidden="true"
                    className="text-gold transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-forest"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
