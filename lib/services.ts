/**
 * The five service lines.
 *
 * Each one comes straight from the brief, where an objective and a service are
 * stated as a matched pair — the promise and the thing that delivers it. That
 * pairing is the spine of the site, so it is modelled explicitly here.
 *
 * `flow` is how the line converts. Nobody books a wedding from a calendar, so
 * the high-touch lines take a structured enquiry, the recurring ones take a
 * real booking, and purchase facilitation collects a sourcing request.
 */
export const SERVICE_FLOWS = ["booking", "enquiry", "request-list"] as const;
export type ServiceFlow = (typeof SERVICE_FLOWS)[number];

export type Service = {
  /** Stable id, also the i18n key namespace. */
  id: string;
  /** URL segment, French (the default locale). */
  slug: string;
  /** Editorial rail number, 01–05. */
  index: string;
  flow: ServiceFlow;
  /** Where the page's primary call to action goes. */
  action: string;
};

export const services: readonly Service[] = [
  {
    id: "events",
    slug: "evenements",
    index: "01",
    flow: "enquiry",
    action: "/devis?service=events",
  },
  {
    id: "coaching",
    slug: "coaching",
    index: "02",
    flow: "booking",
    action: "/reservation/coaching",
  },
  {
    id: "home",
    slug: "menage-decoration",
    index: "03",
    flow: "booking",
    action: "/reservation/menage",
  },
  {
    id: "property",
    slug: "gestion-locative",
    index: "04",
    flow: "enquiry",
    action: "/devis?service=property",
  },
  {
    id: "sourcing",
    slug: "achats",
    index: "05",
    flow: "request-list",
    action: "/catalogue",
  },
] as const;

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceById = (id: string) => services.find((s) => s.id === id);

export const serviceSlugs = services.map((s) => s.slug);
