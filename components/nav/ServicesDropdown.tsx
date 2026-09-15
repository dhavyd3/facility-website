"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";

export type ServiceEntry = {
  href: string;
  label: string;
};

/**
 * "Nos services" as a small frosted dropdown showing service names only.
 * Entries come from lib/services.ts via SiteHeader, so the five lines cannot
 * drift apart from the rest of the site.
 *
 * The trigger stays a real link to /services: the panel augments it rather
 * than swallowing the click. Opens on hover and on keyboard focus, closes on
 * Escape, outside click, or focus leaving the group.
 *
 * The panel is always rendered and switched with data-open + inert instead of
 * the hidden attribute. `hidden` is display:none, which would leave the
 * entrance animation nothing to animate; `inert` keeps the closed panel out of
 * the tab order and the accessibility tree. The two visual layers, and why the
 * glass animates its own opacity, are explained at .nav-dropdown in
 * globals.css.
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
  // crosses from the trigger to the panel.
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
           should reveal the panel without depending on focusin bubbling. */
        onFocus={openNow}
        className="meta nav-link whitespace-nowrap"
      >
        {label}
      </Link>

      <div
        id={panelId}
        className="nav-dropdown"
        data-open={open}
        inert={!open}
      >
        <ul className="nav-dropdown__panel">
          {services.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                data-dd-item
                className="nav-dropdown__item"
                onClick={() => setOpen(false)}
              >
                {/* .meta gives the navbar face, and trims the underline so it
                    ends at the last letter. The underline lives on the label,
                    not the padded row, so it spans the words only. */}
                <span className="meta nav-link">{service.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
