import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Editorial form fields: no box, a hairline underneath, and a label that sits
 * inside the field until there is something to make room for.
 *
 * The label floats on `:placeholder-shown`, so it works before hydration and
 * without JS; that is why every control carries placeholder=" ". On focus a
 * gold line wipes left to right over the hairline, the same motion and timing
 * as the link underline, so typing into a field feels like the rest of the site.
 *
 * Errors are plain text in the negative tone (Rule 2), announced through
 * aria-describedby rather than a coloured box.
 */
type FieldChrome = {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
  /** Right-aligned beside the hint or error, e.g. a character counter. */
  aside?: ReactNode;
  optionalLabel?: string;
};

function describedBy(name: string, error?: string, hint?: ReactNode) {
  if (error) return `${name}-error`;
  if (hint) return `${name}-hint`;
  return undefined;
}

function FieldShell({
  name,
  label,
  error,
  hint,
  aside,
  optionalLabel,
  className,
  children,
}: FieldChrome & { className?: string; children: ReactNode }) {
  return (
    <div
      className={["field", className].filter(Boolean).join(" ")}
      data-invalid={error ? "true" : undefined}
    >
      <div className="field__box">
        {children}
        <label htmlFor={`field-${name}`} className="field__label">
          {label}
          {optionalLabel && (
            <span className="field__optional"> · {optionalLabel}</span>
          )}
        </label>
      </div>

      {(error || hint || aside) && (
        <div className="field__foot">
          {error ? (
            <p id={`${name}-error`} className="text-negative">
              {error}
            </p>
          ) : hint ? (
            <p id={`${name}-hint`} className="text-muted">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {aside}
        </div>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  error,
  hint,
  aside,
  optionalLabel,
  className,
  ...rest
}: FieldChrome & Omit<ComponentPropsWithoutRef<"input">, "name">) {
  return (
    <FieldShell {...{ label, name, error, hint, aside, optionalLabel, className }}>
      <input
        id={`field-${name}`}
        name={name}
        placeholder=" "
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextArea({
  label,
  name,
  error,
  hint,
  aside,
  optionalLabel,
  className,
  ...rest
}: FieldChrome & Omit<ComponentPropsWithoutRef<"textarea">, "name">) {
  return (
    <FieldShell {...{ label, name, error, hint, aside, optionalLabel, className }}>
      <textarea
        id={`field-${name}`}
        name={name}
        placeholder=" "
        rows={4}
        className="field__control field__control--area"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
}
