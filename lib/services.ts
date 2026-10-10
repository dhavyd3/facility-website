/**
 * The five service lines.
 *
 * Each one comes straight from the brochure, where an objective and a service
 * are stated as a matched pair — the promise and the thing that delivers it.
 * That pairing is the spine of the site, so it is modelled explicitly here.
 *
 * `pole` is the branch the line belongs to. The brochure, like the logo, sorts
 * everything Facility does into two: Events and Services.
 *
 * `flow` is how the line converts. Nobody books a wedding from a calendar, so
 * the high-touch lines take a structured enquiry, the recurring ones take a
 * real booking, and purchase facilitation collects a sourcing request.
 */
export const SERVICE_FLOWS = ["booking", "enquiry", "request-list"] as const;
export type ServiceFlow = (typeof SERVICE_FLOWS)[number];

export const SERVICE_POLES = ["events", "services"] as const;
export type ServicePole = (typeof SERVICE_POLES)[number];

export type Service = {
  /** Stable id, also the i18n key namespace. */
  id: string;
  /** URL segment, French (the default locale). */
  slug: string;
  /** Editorial rail number, 01–05. */
  index: string;
  pole: ServicePole;
  flow: ServiceFlow;
  /** Where the page's primary call to action goes. */
  action: string;
};

export const services: readonly Service[] = [
  {
    id: "events",
    slug: "evenements",
    index: "01",
    pole: "events",
    flow: "enquiry",
    action: "/contact?service=events",
  },
  {
    id: "teens",
    slug: "adolescents",
    index: "02",
    pole: "events",
    flow: "enquiry",
    action: "/contact?service=teens",
  },
  {
    id: "home",
    slug: "menage-decoration",
    index: "03",
    pole: "services",
    flow: "booking",
    action: "/reservation/menage",
  },
  {
    id: "property",
    slug: "gestion-locative",
    index: "04",
    pole: "services",
    flow: "enquiry",
    action: "/contact?service=property",
  },
  {
    id: "sourcing",
    slug: "achats",
    index: "05",
    pole: "services",
    flow: "request-list",
    action: "/catalogue",
  },
] as const;

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceById = (id: string) => services.find((s) => s.id === id);

export const serviceSlugs = services.map((s) => s.slug);
