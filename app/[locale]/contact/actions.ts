"use server";

import {
  readEnquiry,
  validateEnquiry,
  type EnquiryState,
} from "@/lib/contact";

/**
 * Receives the contact form. Validation reruns here: the inline checks in the
 * browser are a courtesy, this is the one that counts.
 *
 * There is no delivery channel yet (no database, no email; see .env.example).
 * In development the enquiry is logged so the flow can be tested end to end.
 * In production the action reports failure instead of pretending, because a
 * "thank you" for a message nobody will read loses the lead silently.
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

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] enquiry received (dev only, not delivered)", enquiry);
    return { status: "sent" };
  }

  // TODO(database phase): store the enquiry and notify NOTIFY_EMAIL_TO.
  return { status: "failed" };
}
