"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Meta, RailNumber } from "@/components/ui/Meta";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  serviceLinks,
}: {
  links: NavLink[];
  serviceLinks: (NavLink & { index: string })[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  // Close on Escape, and stop the page scrolling behind the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="meta text-espresso"
        aria-expanded={open}
      >
        {t("menu")}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto bg-cream">
          <div className="shell flex items-center justify-between py-5 hairline-b">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="meta text-gold"
            >
              {t("close")}
            </button>
          </div>

          <nav className="shell py-10" aria-label={t("menu")}>
            <Meta tone="muted">{t("services")}</Meta>
            <ul className="mt-6 mb-12">
              {serviceLinks.map((link) => (
                <li key={link.href} className="hairline-b py-4">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4"
                  >
                    <RailNumber>{link.index}</RailNumber>
                    <span className="display display-md">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mb-12">
              {links
                .filter((l) => l.href !== "/services")
                .map((link) => (
                  <li key={link.href} className="py-3">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="meta text-espresso"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>

            <ButtonLink href="/contact" variant="solid" className="w-full">
              {t("quote")}
            </ButtonLink>
          </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
