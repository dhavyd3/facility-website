import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { ServicesDropdown } from "./ServicesDropdown";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const s = await getTranslations("services");

  // "Nos services" is handled by the dropdown, so it is not in this list.
  const links = [
    { href: "/catalogue", label: t("catalogue") },
    { href: "/a-propos", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const serviceLinks = services.map((service) => ({
    href: `/services/${service.slug}`,
    label: s(`${service.id}.name`),
    objective: s(`${service.id}.objective`),
    index: service.index,
  }));

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm hairline-b">
      <div className="shell flex items-center justify-between gap-6 py-5">
        <Logo priority width={148} />

        <nav
          className="hidden items-center gap-8 xl:flex"
          aria-label={t("menu")}
        >
          <ServicesDropdown label={t("services")} services={serviceLinks} />

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="meta whitespace-nowrap text-espresso transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 xl:flex">
          <LanguageSwitcher />
          <ButtonLink href="/devis" variant="outline" className="whitespace-nowrap">
            {t("quote")}
          </ButtonLink>
        </div>

        <MobileNav
          links={[{ href: "/services", label: t("services") }, ...links]}
          serviceLinks={serviceLinks}
        />
      </div>
    </header>
  );
}
