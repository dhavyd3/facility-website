import { services } from "@/lib/services";

/**
 * The contact enquiry, shared by the form and its Server Action so the browser
 * and the server can never disagree about what counts as valid.
 *
 * Deliberately plain TypeScript rather than a schema library: it ships to the
 * client for inline validation, and these few rules don't justify the bytes.
 */
export const MESSAGE_MAX = 1000;

/** One subject per service line, plus a way out for everything else. */
export const SUBJECTS = [...services.map((s) => s.id), "other"];

export const REPLY_METHODS = ["email", "phone", "whatsapp"] as const;
export type ReplyMethod = (typeof REPLY_METHODS)[number];

export type Enquiry = {
  subject: string;
  name: string;
  email: string;
  phone: string;
  replyBy: ReplyMethod;
  message: string;
};

export type EnquiryField = "subject" | "name" | "email" | "phone" | "message";

/** Message keys, resolved to text by the form in the visitor's language. */
export type EnquiryError =
  | "required"
  | "invalidEmail"
  | "chooseService"
  | "phoneRequired"
  | "tooLong";

export type EnquiryErrors = Partial<Record<EnquiryField, EnquiryError>>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "invalid"; errors: EnquiryErrors }
  | { status: "sent" }
  | { status: "failed" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readEnquiry(data: FormData): Enquiry {
  const text = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const replyBy = text("replyBy");

  return {
    subject: text("subject"),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    replyBy: (REPLY_METHODS as readonly string[]).includes(replyBy)
      ? (replyBy as ReplyMethod)
      : "email",
    message: text("message"),
  };
}

export function validateEnquiry(enquiry: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!SUBJECTS.includes(enquiry.subject)) errors.subject = "chooseService";
  if (!enquiry.name) errors.name = "required";

  if (!enquiry.email) errors.email = "required";
  else if (!EMAIL.test(enquiry.email)) errors.email = "invalidEmail";

  // A phone number is optional, until the visitor asks us to use one.
  if (enquiry.replyBy !== "email" && !enquiry.phone) {
    errors.phone = "phoneRequired";
  }

  if (!enquiry.message) errors.message = "required";
  else if (enquiry.message.length > MESSAGE_MAX) errors.message = "tooLong";

  return errors;
}
