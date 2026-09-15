/**
 * Every real-world fact about the business lives here, in one place.
 *
 * The brief (facility.docx) supplied the name, motto, mission and values but
 * no country, city, phone, email or legal entity. Those are marked TODO and
 * are the only edits needed before launch.
 */
export const site = {
  name: "Facility services",
  shortName: "F.S",
  motto: "Make your life easy.",

  /** TODO — confirm with the client. Drives phone format, hreflang, JSON-LD. */
  country: "TODO_COUNTRY",
  countryCode: "TODO_CC", // ISO 3166-1 alpha-2, e.g. "RW", "FR", "CA"
  city: "TODO_CITY",
  addressLine: "TODO_ADDRESS",

  /** TODO — confirm with the client. */
  phone: "TODO_PHONE",
  email: "TODO_EMAIL",

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
  "Country, city and street address",
  "Phone number and public email",
  "Social handles",
  "Registered legal name for the footer",
  "Vector (SVG) logo — the supplied PNGs are 500x500 and will look soft",
  "Confirm the logo is final: its subtitle names 3 of the 5 service lines",
] as const;
