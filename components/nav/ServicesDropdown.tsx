"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { RailNumber } from "@/components/ui/Meta";

export type ServiceEntry = {
  href: string;
  label: string;
  objective: string;
  index: string;
};

/**
 * "Nos services" as a dropdown, built in Facility's own header language —
 * cream panel, gold hairline, the same 01-05 numbering the rail uses. Entries
 * come from lib/services.ts via SiteHeader, so the five lines cannot drift
 * apart from the rest of the site.
 *
 * The trigger stays a real link to /services: the panel augments it rather
 * than swallowing the click. Opens on hover and on keyboard focus, closes on
 * Escape, outside click, or focus leaving the group.
 *
 * Anchored inside the header on purpose. Note the header sets backdrop-blur,
 * and backdrop-filter establishes a containing block for absolute/fixed
 * descendants — which is exactly what made the mobile panel render at header
 * height once already. Anchoring to the header is the intent here; anything
 * that needs the viewport would have to be portalled instead.
 */
export function ServicesDropdown({
  label,
  services,
}: {
  label: string;
  services: ServiceEntry[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // A small delay on close keeps the panel from vanishing while the pointer
  // crosses the gap between the trigger and the panel.
  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        wrap.current?.querySelector<HTMLElement>("a")?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  const itemsOf = () =>
    Array.from(
      wrap.current?.querySelectorAll<HTMLElement>("[data-dd-item]") ?? [],
    );

  /** Arrow keys walk the panel once it is open. */
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = itemsOf();
    if (items.length === 0) return;
    e.preventDefault();

    // ArrowDown from the closed trigger opens the panel and steps into it,
    // which is the interaction ARIA expects of a menu trigger.
    if (!open) {
      setOpen(true);
      requestAnimationFrame(() => itemsOf()[0]?.focus());
      return;
    }

    const at = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? (at + 1) % items.length
        : (at - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onKeyDown={onPanelKeyDown}
    >
      <Link
        href="/services"
        aria-expanded={open}
        aria-controls={panelId}
        /* Also on the trigger itself, not only the wrapper: tabbing to it
           should reveal the panel, and this does not depend on focusin
           bubbling to the containing div. */
        onFocus={openNow}
        className="meta whitespace-nowrap text-espresso transition-colors hover:text-gold"
      >
        {label}
      </Link>

      <div
        id={panelId}
        hidden={!open}
        className="absolute start-0 top-full z-50 w-[26rem] border border-[var(--gold-rule-hair)] bg-cream shadow-[0_18px_50px_-28px_rgba(42,35,24,0.45)]"
      >
        <ul>
          {services.map((service, i) => (
            <li
              key={service.href}
              /* Not `last:border-b-0`: .hairline-b is unlayered CSS and would
                 win over a layered Tailwind utility. */
              className={i < services.length - 1 ? "hairline-b" : undefined}
            >
              <Link
                href={service.href}
                data-dd-item
                className="group block px-6 py-4 transition-colors hover:bg-champagne/40"
                onClick={() => setOpen(false)}
              >
                <span className="flex items-baseline gap-3">
                  <RailNumber>{service.index}</RailNumber>
                  <span className="display text-xl transition-colors group-hover:text-gold">
                    {service.label}
                  </span>
                </span>
                {/* A description, not a label — so plain text, not <Meta>. */}
                <p className="mt-2 text-sm text-muted">{service.objective}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
