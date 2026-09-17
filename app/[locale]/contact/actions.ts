"use server";

import { getTranslations } from "next-intl/server";

import {
  readEnquiry,
  validateEnquiry,
  type EnquiryState,
} from "@/lib/contact";
import { sendEnquiryEmail } from "@/lib/enquiry-email";

/**
 * Receives the contact form. Validation reruns here: the inline checks in the
 * browser are a courtesy, this is the one that counts.
 *
 * A valid enquiry is emailed to the team through Resend (see lib/enquiry-email.ts).
 * If that fails the visitor is told so, rather than thanked for a message
 * nobody will read — except in development, where there is usually no API key
 * and the form still has to be testable.
 */
export async function sendEnquiry(
  _previous: EnquiryState,
  data: FormData,
): Promise<EnquiryState> {
  // Honeypot: people never see this field, bots fill in everything.
  if (data.get("company")) return { status: "sent" };

  const enquiry = readEnquiry(data);
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const locale = (() => {
    const value = data.get("locale");
    return typeof value === "string" && value ? value : "fr";
  })();

  // The team reads French, so the notification is in French whichever side of
  // the site the visitor came from.
  const services = await getTranslations({ locale: "fr", namespace: "services" });
  const contact = await getTranslations({ locale: "fr", namespace: "contact" });
  const serviceLabel =
    enquiry.subject === "other"
      ? contact("other")
      : services(`${enquiry.subject}.name`);

  const sent = await sendEnquiryEmail({ enquiry, serviceLabel, locale });
  if (sent.ok) return { status: "sent" };

  // Delivery failed, so this log is the only remaining copy of a real lead.
  console.error("[contact] enquiry email failed:", sent.error, enquiry);

  return process.env.NODE_ENV === "production"
    ? { status: "failed" }
    : { status: "sent" };
}
