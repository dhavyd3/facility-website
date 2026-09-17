/**
 * Every real-world fact about the business lives here, in one place.
 *
 * Contact details come from the client's brochure (FACILITY - Brochure FR).
 * Anything still marked TODO is withheld by the components that print it, so
 * a placeholder can never reach a visitor.
 */
export const site = {
  name: "Facility services",
  shortName: "F.S",
  motto: "Make your life easy.",

  country: "Burundi",
  countryCode: "BI", // ISO 3166-1 alpha-2
  city: "Bujumbura",
  addressLine: "Kinindo, Av. Remera n°4",

  phone: "+257 69 52 50 07",
  email: "dusekathia@gmail.com",

  founder: {
    name: "DUSENGE KATHIA DASLIM",
  },

  social: {
    instagram: "", // TODO
    facebook: "", // TODO
    whatsapp: "", // TODO
    linkedin: "", // TODO
  },

  /** Quote-only: no prices are displayed anywhere and no payment is taken. */
  pricingMode: "quote-only" as const,

  url: "https://facility-services.example", // TODO — production domain
} satisfies Record<string, unknown>;

export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr" satisfies (typeof locales)[number];
export type Locale = (typeof locales)[number];

/** Facts that still need the client before the site can go live. */
export const OPEN_ITEMS = [
  "Social handles",
  "Registered legal name for the footer",
  "Vector (SVG) logo — the supplied PNGs are 500x500 and will look soft",
  "Confirm the logo is final: its subtitle names 3 of the 5 service lines",
] as const;
