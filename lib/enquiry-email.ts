import { site } from "@/site.config";
import type { Enquiry } from "@/lib/contact";

/**
 * The notification sent to the team when someone uses the contact form.
 *
 * Always written in French, whichever side of the site the visitor used,
 * because the team reads French.
 *
 * Every style is inline and the layout is tables: email clients drop <style>
 * blocks, ignore flex and grid, and never load web fonts — so the brand's
 * Bodoni falls back to the same serif stack globals.css names, and the colours
 * are repeated here as literals because an email cannot read our CSS.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const CREAM = "#faf7f1";
const CHAMPAGNE = "#eadfcb";
const ESPRESSO = "#2a2318";
const GOLD_ON_DARK = "#c9a46a";
const MUTED = "#655c4e";
const MUTED_ON_DARK = "#a79a85";
const RULE = "rgba(176, 141, 74, 0.38)";

const DISPLAY = "'Iowan Old Style', Palatino, Georgia, 'Times New Roman', serif";
const BODY = "Helvetica, Arial, 'Helvetica Neue', sans-serif";

const REPLY_LABEL: Record<string, string> = {
  email: "Par e-mail",
  phone: "Par téléphone",
  whatsapp: "Sur WhatsApp",
};

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const breaks = (value: string) => esc(value).replace(/\r?\n/g, "<br />");

/** NOTIFY_EMAIL_TO keeps the team's own inbox out of the repository. */
const recipient = () => process.env.NOTIFY_EMAIL_TO?.trim() || site.email;

/**
 * Resend only accepts a sender on a domain you have verified with them. Until
 * that is done, onboarding@resend.dev is the one address that works, and
 * Resend will deliver it to the account owner's address only.
 */
const sender = () =>
  process.env.NOTIFY_EMAIL_FROM?.trim() ||
  `"${site.name} (site web)" <onboarding@resend.dev>`;

/**
 * An email cannot use relative image paths, so the logo needs the public
 * origin. Anything that is not a real https site (the placeholder domain, or
 * localhost during development) falls back to a typeset wordmark.
 */
const baseUrl = () => {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || site.url)
    .trim()
    .replace(/\/+$/, "");
  return /^https:\/\//.test(raw) && !raw.includes("example") ? raw : null;
};

function row(label: string, valueHtml: string) {
  return `<tr>
  <td style="width:36%;padding:13px 0;border-bottom:1px solid ${RULE};font-family:${BODY};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};vertical-align:top;">${esc(label)}</td>
  <td style="padding:13px 0;border-bottom:1px solid ${RULE};font-family:${BODY};font-size:15px;line-height:1.5;color:${ESPRESSO};vertical-align:top;">${valueHtml}</td>
</tr>`;
}

function logoBlock(origin: string | null) {
  if (origin) {
    return `<img src="${origin}/brand/facility-mark-dark.png" width="64" height="41" alt="${esc(site.name)}" style="display:block;border:0;outline:none;text-decoration:none;" />`;
  }
  return `<div style="font-family:${DISPLAY};font-size:15px;line-height:1.2;color:${GOLD_ON_DARK};">F.S</div>`;
}

export function renderEnquiryEmail({
  enquiry,
  serviceLabel,
  locale,
}: {
  enquiry: Enquiry;
  serviceLabel: string;
  locale: string;
}) {
  const received = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Bujumbura",
  }).format(new Date());

  const origin = baseUrl();
  const firstName = enquiry.name.split(" ")[0] || enquiry.name;
  const replyLabel = REPLY_LABEL[enquiry.replyBy] ?? REPLY_LABEL.email;
  const subject = `[Facility] Nouvelle demande — ${serviceLabel} · ${enquiry.name}`;

  /** Shown after the subject in the inbox list, before anything is opened. */
  const preheader = `${serviceLabel} · ${enquiry.name} · ${replyLabel}${enquiry.phone ? ` · ${enquiry.phone}` : ""}`;

  const rows = [
    row("Service", esc(serviceLabel)),
    row("Nom", esc(enquiry.name)),
    row(
      "E-mail",
      `<a href="mailto:${esc(enquiry.email)}" style="color:${ESPRESSO};text-decoration:underline;">${esc(enquiry.email)}</a>`,
    ),
    row(
      "Téléphone",
      enquiry.phone
        ? `<a href="tel:${esc(enquiry.phone.replace(/[^\d+]/g, ""))}" style="color:${ESPRESSO};text-decoration:underline;">${esc(enquiry.phone)}</a>`
        : `<span style="color:${MUTED};">Non renseigné</span>`,
    ),
    row("Réponse souhaitée", esc(replyLabel)),
    row("Langue du site", locale === "en" ? "Anglais" : "Français"),
  ].join("\n");

  const webRow = origin
    ? `<div><strong style="color:${GOLD_ON_DARK};font-weight:normal;">W</strong>&nbsp;&nbsp;<a href="${origin}" style="color:${CHAMPAGNE};text-decoration:none;">${esc(origin.replace(/^https:\/\//, ""))}</a></div>`
    : "";

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${CHAMPAGNE};">
<div style="display:none;font-size:1px;color:${CHAMPAGNE};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CHAMPAGNE};padding:28px 12px;">
<tr><td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${CREAM};">

  <tr><td style="background:${ESPRESSO};padding:26px 32px;">
    <div style="font-family:${BODY};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${GOLD_ON_DARK};">Nouvelle demande</div>
    <div style="margin-top:10px;font-family:${DISPLAY};font-size:26px;line-height:1.25;color:${CREAM};">${esc(serviceLabel)}</div>
    <div style="margin-top:8px;font-family:${BODY};font-size:12px;color:${MUTED_ON_DARK};">${esc(received)}</div>
  </td></tr>

  <tr><td style="padding:8px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${rows}
    </table>
  </td></tr>

  <tr><td style="padding:26px 32px 0;">
    <div style="font-family:${BODY};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">Message</div>
    <div style="margin-top:12px;background:${CHAMPAGNE};padding:20px 22px;font-family:${BODY};font-size:15px;line-height:1.7;color:${ESPRESSO};">${breaks(enquiry.message)}</div>
  </td></tr>

  <tr><td style="padding:26px 32px 32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${ESPRESSO};border-radius:9999px;">
        <a href="mailto:${esc(enquiry.email)}?subject=${encodeURIComponent(`Votre demande — ${site.name}`)}" style="display:inline-block;padding:14px 28px;font-family:${BODY};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${CREAM};text-decoration:none;">Répondre à ${esc(firstName)}</a>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="background:${ESPRESSO};padding:28px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="84" valign="top" style="padding-right:20px;">${logoBlock(origin)}</td>
      <td valign="top" style="font-family:${BODY};font-size:12px;line-height:1.7;color:${CHAMPAGNE};">
        <div style="font-family:${DISPLAY};font-size:18px;line-height:1.2;color:${CREAM};">${esc(site.name)}</div>
        <div style="margin-top:4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${GOLD_ON_DARK};">${esc(site.motto)}</div>
        <div style="margin-top:12px;">${esc(site.addressLine)}<br />${esc(site.city)}, ${esc(site.country)}</div>
        <div style="margin-top:10px;"><strong style="color:${GOLD_ON_DARK};font-weight:normal;">T</strong>&nbsp;&nbsp;${esc(site.phone)}</div>
        <div><strong style="color:${GOLD_ON_DARK};font-weight:normal;">E</strong>&nbsp;&nbsp;<a href="mailto:${esc(site.email)}" style="color:${CHAMPAGNE};text-decoration:none;">${esc(site.email)}</a></div>
        ${webRow}
      </td>
    </tr></table>

    <div style="margin-top:22px;border-top:1px solid rgba(201,164,106,0.35);padding-top:14px;font-family:${BODY};font-size:10px;line-height:1.7;color:${MUTED_ON_DARK};">
      Ce message a été envoyé automatiquement depuis le formulaire de contact du site ${esc(site.name)}. Il est confidentiel et destiné à l'équipe Facility. Si vous le recevez par erreur, merci de le supprimer et d'en informer l'expéditeur. Répondre à ce message écrit directement à ${esc(enquiry.name)}.
    </div>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    `NOUVELLE DEMANDE — ${serviceLabel}`,
    received,
    "",
    `Service : ${serviceLabel}`,
    `Nom : ${enquiry.name}`,
    `E-mail : ${enquiry.email}`,
    `Téléphone : ${enquiry.phone || "non renseigné"}`,
    `Réponse souhaitée : ${replyLabel}`,
    `Langue du site : ${locale === "en" ? "Anglais" : "Français"}`,
    "",
    "Message :",
    enquiry.message,
    "",
    "—",
    `${site.name} · ${site.motto}`,
    `${site.addressLine}, ${site.city}, ${site.country}`,
    `T ${site.phone} · E ${site.email}`,
  ].join("\n");

  return { subject, html, text };
}

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export async function sendEnquiryEmail(input: {
  enquiry: Enquiry;
  serviceLabel: string;
  locale: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };

  const { subject, html, text } = renderEnquiryEmail(input);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender(),
        to: [recipient()],
        // A reply goes straight to the visitor, not to the website.
        reply_to: input.enquiry.email,
        subject,
        html,
        text,
      }),
      // Someone is waiting on the form; give up rather than hang.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        error: `Resend responded ${response.status}: ${body.slice(0, 300)}`,
      };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : String(cause),
    };
  }
}
