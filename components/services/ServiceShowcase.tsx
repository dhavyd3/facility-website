"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

import { ArrowLink } from "@/components/ui/Button";

export type ShowcaseService = {
  id: string;
  slug: string;
  /** Editorial rail number, 01–05. */
  index: string;
  name: string;
  short: string;
  objective: string;
  image: string;
};

/**
 * The five service lines as panels side by side. One is open and takes the
 * room; the rest stay as narrow strips carrying their number and name. Opening
 * another closes the previous one back into a strip rather than sending it
 * away, so a visitor can always click straight back to it.
 *
 * Two ideas are borrowed from the reference carousel. The widths are shares of
 * the row worked out in CSS, so nothing has to be measured. And each picture is
 * drawn at the width of the OPEN panel and centred, so a panel that narrows
 * crops its picture from the middle instead of rescaling and resampling it
 * every frame.
 *
 * Marked up as a disclosure set, not tabs: the copy lives inside each panel, so
 * each trigger owns the region it opens (a tablist may only contain tabs). The
 * closed copy is `visibility: hidden`, which keeps its link out of the tab
 * order and out of the accessibility tree.
 */
export function ServiceShowcase({
  services,
  learnMore,
}: {
  services: ShowcaseService[];
  learnMore: string;
}) {
  const [open, setOpen] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = services.length - 1;
    const moves: Record<string, number | undefined> = {
      ArrowRight: open === last ? 0 : open + 1,
      ArrowDown: open === last ? 0 : open + 1,
      ArrowLeft: open === 0 ? last : open - 1,
      ArrowUp: open === 0 ? last : open - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    setOpen(next);
    triggers.current[next]?.focus();
  };

  return (
    <ul className="svc-row" onKeyDown={onKeyDown}>
      {services.map((service, i) => {
        const isOpen = i === open;

        return (
          <li
            key={service.id}
            className="svc-panel"
            data-open={isOpen ? "true" : undefined}
          >
            <span className="svc-panel__figure" aria-hidden="true">
              <Image
                src={service.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
            </span>
            <span className="svc-panel__veil" aria-hidden="true" />
            <span className="svc-panel__mat" aria-hidden="true" />

            <button
              ref={(node) => {
                triggers.current[i] = node;
              }}
              type="button"
              id={`svc-trigger-${service.id}`}
              className="svc-panel__trigger"
              aria-expanded={isOpen}
              aria-controls={`svc-content-${service.id}`}
              onClick={() => setOpen(i)}
            >
              <span className="meta svc-panel__no" data-tone="accent">
                {service.index}
              </span>
              <span className="display svc-panel__stem">{service.name}</span>
            </button>

            <div
              id={`svc-content-${service.id}`}
              role="region"
              aria-labelledby={`svc-trigger-${service.id}`}
              className="svc-panel__face"
            >
              <span className="meta" data-tone="accent">
                {service.index}
              </span>
              <h3 className="display svc-panel__name">{service.name}</h3>
              <p className="svc-panel__short">{service.short}</p>
              <p className="svc-panel__objective">{service.objective}</p>
              <ArrowLink
                href={`/services/${service.slug}`}
                className="svc-panel__link"
              >
                {learnMore}
              </ArrowLink>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
