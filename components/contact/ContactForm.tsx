"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";

import { sendEnquiry } from "@/app/[locale]/contact/actions";
import {
  MESSAGE_MAX,
  REPLY_METHODS,
  SUBJECTS,
  validateEnquiry,
  type Enquiry,
  type EnquiryError,
  type EnquiryField,
  type EnquiryState,
  type ReplyMethod,
} from "@/lib/contact";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { TextArea, TextField } from "@/components/ui/Field";
import { Meta } from "@/components/ui/Meta";
import { Sparkle } from "@/components/editorial/Sparkle";

const FIELD_ORDER: EnquiryField[] = [
  "subject",
  "name",
  "email",
  "phone",
  "message",
];

const REPLY_LABEL: Record<ReplyMethod, string> = {
  email: "replyEmail",
  phone: "replyPhone",
  whatsapp: "replyWhatsapp",
};

const INITIAL: EnquiryState = { status: "idle" };

/**
 * The contact form, in three steps down the same dash-dot rail as the home
 * page: each diamond fills as its step becomes valid, and the line draws down
 * to the next one. Nothing is hidden behind a "next" button; the rail is
 * encouragement, not a gate.
 *
 * Errors appear once a field has been left, or after a submit attempt, never
 * while someone is still typing their first letters.
 */
export function ContactForm({
  initialSubject = "",
}: {
  initialSubject?: string;
}) {
  // Remounting is the one clean way to reset useActionState after a send.
  const [round, setRound] = useState(0);

  return (
    <EnquiryForm
      key={round}
      initialSubject={round === 0 ? initialSubject : ""}
      onReset={() => setRound((r) => r + 1)}
    />
  );
}

function EnquiryForm({
  initialSubject,
  onReset,
}: {
  initialSubject: string;
  onReset: () => void;
}) {
  const t = useTranslations("contact");
  const f = useTranslations("forms");
  const s = useTranslations("services");
  const [state, formAction, pending] = useActionState(sendEnquiry, INITIAL);

  // Controlled on purpose: React resets uncontrolled fields after a form
  // action, which would wipe the visitor's text if the server sent it back.
  const [values, setValues] = useState<Enquiry>({
    subject: initialSubject,
    name: "",
    email: "",
    phone: "",
    replyBy: "email",
    message: "",
  });
  const [touched, setTouched] = useState<
    Partial<Record<EnquiryField, boolean>>
  >({});
  const [attempted, setAttempted] = useState(false);

  if (state.status === "sent") return <Sent onReset={onReset} />;

  const errors = validateEnquiry(values);
  const showAll = attempted || state.status === "invalid";

  const errorText = (code?: EnquiryError) => {
    if (!code) return undefined;
    if (code === "required" || code === "invalidEmail") return f(code);
    if (code === "tooLong") return t("tooLong", { max: MESSAGE_MAX });
    return t(code);
  };

  const errorFor = (field: EnquiryField) =>
    showAll || touched[field] ? errorText(errors[field]) : undefined;

  const set =
    (field: keyof Enquiry) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const leave = (field: EnquiryField) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (!first) return; // valid: let the Server Action run

    // Preventing default here also stops React from dispatching the action.
    event.preventDefault();
    setAttempted(true);
    const form = event.currentTarget;
    const target =
      first === "subject"
        ? form.querySelector<HTMLElement>('input[name="subject"]')
        : form.querySelector<HTMLElement>(`#field-${first}`);
    target?.focus();
  };

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const count = values.message.length;
  const counterTone =
    count >= MESSAGE_MAX
      ? "negative"
      : count > MESSAGE_MAX * 0.9
        ? "attention"
        : "muted";

  const subjectError = errorFor("subject");

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className="contact-form"
    >
      <Step
        index="01"
        title={t("step1")}
        done={!errors.subject}
        describedBy={subjectError ? "subject-error" : undefined}
      >
        <div className="flex flex-wrap gap-3">
          {SUBJECTS.map((id) => (
            <FilterChip
              key={id}
              name="subject"
              value={id}
              checked={values.subject === id}
              onChange={set("subject")}
            >
              {id === "other" ? t("other") : s(`${id}.name`)}
            </FilterChip>
          ))}
        </div>
        {subjectError && (
          <p id="subject-error" className="mt-4 text-sm text-negative">
            {subjectError}
          </p>
        )}
      </Step>

      <Step
        index="02"
        title={t("step2")}
        done={!errors.name && !errors.email && !errors.phone}
      >
        <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
          <TextField
            name="name"
            label={f("name")}
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            onBlur={leave("name")}
            error={errorFor("name")}
          />
          <TextField
            name="email"
            type="email"
            label={f("email")}
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={set("email")}
            onBlur={leave("email")}
            error={errorFor("email")}
          />

          <div className="md:col-span-2">
            <p id="reply-by-label" className="meta" data-tone="muted">
              {t("replyBy")}
            </p>
            <div
              role="radiogroup"
              aria-labelledby="reply-by-label"
              className="mt-4 flex flex-wrap gap-3"
            >
              {REPLY_METHODS.map((method) => (
                <FilterChip
                  key={method}
                  name="replyBy"
                  value={method}
                  checked={values.replyBy === method}
                  onChange={set("replyBy")}
                >
                  {t(REPLY_LABEL[method])}
                </FilterChip>
              ))}
            </div>
          </div>

          <TextField
            name="phone"
            type="tel"
            label={f("phone")}
            autoComplete="tel"
            inputMode="tel"
            optionalLabel={
              values.replyBy === "email" ? f("optional") : undefined
            }
            value={values.phone}
            onChange={set("phone")}
            onBlur={leave("phone")}
            error={errorFor("phone")}
          />
        </div>
      </Step>

      <Step index="03" title={t("step3")} done={!errors.message} last>
        <TextArea
          name="message"
          label={f("message")}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={set("message")}
          onBlur={leave("message")}
          onKeyDown={onMessageKeyDown}
          error={errorFor("message")}
          aside={
            <Meta tone={counterTone}>
              {t("counter", { count, max: MESSAGE_MAX })}
            </Meta>
          }
        />
      </Step>

      {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
      <div className="contact-form__trap" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-indent">
        {state.status === "failed" && (
          <div role="alert" className="mb-8">
            <Meta tone="negative">{f("errorTitle")}</Meta>
            <p className="mt-2 text-muted">{f("errorBody")}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-6 hairline-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm text-muted">{t("privacy")}</p>
          <Button
            type="submit"
            variant="solid"
            disabled={pending}
            aria-busy={pending}
            className="contact-form__submit"
          >
            {pending ? f("sending") : t("submit")}
            <span aria-hidden="true" className="contact-form__arrow">
              &rarr;
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}

function Step({
  index,
  title,
  done,
  last = false,
  describedBy,
  children,
}: {
  index: string;
  title: string;
  done: boolean;
  last?: boolean;
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <fieldset
      className="form-step"
      data-state={done ? "done" : "open"}
      aria-describedby={describedBy}
    >
      <svg className="form-step__marker" width={16} height={16} aria-hidden="true">
        <path className="rail-diamond" d="M 8 3 L 13 8 L 8 13 L 3 8 Z" />
      </svg>
      {!last && (
        <>
          <svg className="form-step__track" width={16} aria-hidden="true">
            <line x1="8" y1="0" x2="8" y2="100%" />
          </svg>
          <svg className="form-step__line" width={16} aria-hidden="true">
            <line className="rail-stroke" x1="8" y1="0" x2="8" y2="100%" />
          </svg>
        </>
      )}

      <legend className="form-step__legend">
        <span className="meta" data-tone="accent">
          {index}
        </span>
        <span className="display form-step__title">{title}</span>
      </legend>

      <div className="form-step__body">{children}</div>
    </fieldset>
  );
}

/**
 * The thank-you: the rail runs out to its terminal (the diamond and arrowhead
 * from the logo) and three glints go off beside it.
 */
function Sent({ onReset }: { onReset: () => void }) {
  const t = useTranslations("contact");
  const f = useTranslations("forms");
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // The form was far taller than this, so the page is usually scrolled past
  // the confirmation when it appears. Bring it back into view, then move focus
  // to it so screen readers announce it.
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    root.current?.scrollIntoView({
      block: "center",
      behavior: reduced ? "auto" : "smooth",
    });
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={root} className="form-sent">
      <div className="form-sent__mark" aria-hidden="true">
        <svg className="form-sent__trail" width={168} height={24}>
          <line className="rail-stroke" x1="0" y1="12" x2="168" y2="12" />
        </svg>
        <svg className="form-sent__terminal" width={26} height={24}>
          <path className="rail-arrow" d="M 7 7 L 12 12 L 7 17 L 2 12 Z" />
          <path className="rail-arrow" d="M 13 7 L 21 12 L 13 17 Z" />
        </svg>
        <Sparkle size={18} className="form-sent__spark form-sent__spark--1" />
        <Sparkle size={11} className="form-sent__spark form-sent__spark--2" />
        <Sparkle size={14} className="form-sent__spark form-sent__spark--3" />
      </div>

      <h3
        ref={heading}
        tabIndex={-1}
        className="form-sent__title display display-lg mt-10"
      >
        {f("successTitle")}
      </h3>
      <p className="prose-measure mt-6 text-lg text-muted">
        {f("successBody")}
      </p>
      <div className="mt-10">
        <Button type="button" variant="quiet" onClick={onReset}>
          {t("another")}
        </Button>
      </div>
    </div>
  );
}
