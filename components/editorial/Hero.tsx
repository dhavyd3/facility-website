import type { ReactNode } from "react";
import { Meta } from "@/components/ui/Meta";

export type Fact = { label: string; value: string };

/**
 * Full-bleed editorial hero. The facts strip under the headline is The Nest's
 * device — four hard facts in a ruled row, which does more for credibility
 * than a paragraph of adjectives.
 *
 * `media` is optional so the layout can be verified before the photography
 * exists; without it the hero falls back to a champagne panel.
 */
export function Hero({
  eyebrow,
  title,
  intro,
  actions,
  facts,
  media,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  facts?: Fact[];
  media?: ReactNode;
}) {
  return (
    <section className="shell pt-16 pb-20 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="reveal flex flex-col justify-center">
          <Meta tone="accent">{eyebrow}</Meta>
          <h1 className="display display-xl mt-7">{title}</h1>
          {intro && (
            <p className="prose-measure mt-8 text-lg text-muted">{intro}</p>
          )}
          {actions && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {actions}
            </div>
          )}
        </div>

        <div className="reveal">
          {media ?? (
            <div
              className="ruled-columns aspect-[4/5] w-full bg-champagne"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {facts && facts.length > 0 && (
        <dl className="reveal mt-20 grid grid-cols-2 gap-y-8 hairline-t pt-8 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>
                <Meta tone="muted">{fact.label}</Meta>
              </dt>
              <dd className="display display-md mt-3">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
