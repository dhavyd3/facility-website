import type { ElementType, ReactNode } from "react";

/**
 * The ONLY way to render a non-interactive label.
 *
 * Rule 2: a reading — status, state, priority, count, category, badge — is
 * plain text with the meaning in the text colour. No pill, no border, no
 * tinted fill, no padding that would imply a hit area. If the user can press
 * or toggle it, it is not a Meta; use Button, FilterChip, Tab or Field.
 *
 * `tone` names the ROLE, not a colour. The ground it lands on picks the
 * text-safe step (see [data-tone] in globals.css), so the same tone stays
 * legible on cream and on espresso without the caller thinking about it.
 *
 * Adjacent labels get their ~20px of air from `.meta + .meta` — set on the
 * adjacency, never as container padding, because these carry no box.
 */
export type MetaTone =
  | "default"
  | "accent"
  | "muted"
  | "positive"
  | "attention"
  | "negative";

type MetaProps = {
  children: ReactNode;
  tone?: MetaTone;
  as?: ElementType;
  className?: string;
};

export function Meta({
  children,
  tone = "default",
  as: Tag = "span",
  className,
}: MetaProps) {
  return (
    <Tag
      className={className ? `meta ${className}` : "meta"}
      data-tone={tone === "default" ? undefined : tone}
    >
      {children}
    </Tag>
  );
}

/**
 * The editorial rail number (01–05). A Meta with the display face, used to
 * number service lines the way The Nest numbers its offerings.
 */
export function RailNumber({ children }: { children: ReactNode }) {
  return (
    <span className="meta" data-tone="accent">
      {children}
    </span>
  );
}
