import type { ChangeEvent, ReactNode } from "react";

/**
 * A pressable capsule for picking one option out of a few (Rule 2 allows the
 * capsule here because it can be toggled).
 *
 * It is a real radio input under a styled face, so arrow keys move through the
 * group, the browser submits the value with the form, and screen readers hear
 * a radio group. The input is visually hidden, never display:none, so it stays
 * focusable; the face draws the focus ring instead.
 */
export function FilterChip({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}) {
  return (
    <label className="chip">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="chip__input"
      />
      <span className="chip__face">
        <span className="chip__mark" aria-hidden="true" />
        <span>{children}</span>
      </span>
    </label>
  );
}
