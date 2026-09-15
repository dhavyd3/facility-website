import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * A capsule is allowed here, and in FilterChip / Tab / Field / Switch, because
 * these are the things a user can actually press or toggle (Rule 2). Anything
 * that merely reads as information must be a <Meta> instead.
 *
 * Hover is a left-to-right fill sweep, matching the timing and direction of
 * the link underline in globals.css so the whole site moves the same way.
 * The variant classes live in CSS rather than Tailwind strings because each
 * one also has to set --btn-fill for the sweep.
 */
type Variant = "solid" | "outline" | "quiet";

const BASE =
  "btn inline-flex items-center justify-center gap-2 px-7 py-4 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const VARIANTS: Record<Variant, string> = {
  solid: "btn-solid",
  outline: "btn-outline",
  quiet: "btn-quiet",
};

function classes(variant: Variant, className?: string) {
  return [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");
}

type ButtonAsButton = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  className,
  children,
  ...rest
}: ButtonAsButton) {
  return (
    <button className={classes(variant, className)} {...rest}>
      {/* Wrapped so `.btn > *` can sit above the sweeping fill layer. */}
      <span>{children}</span>
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

/** Same capsule, but it navigates. Uses the locale-aware Link. */
export function ButtonLink({
  href,
  variant = "outline",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={classes(variant, className)}>
      <span>{children}</span>
    </Link>
  );
}

/**
 * The gold arrow link used throughout the editorial layout
 * ("voir les offres →"). Text, not a capsule, so it takes the underline wipe:
 * the line draws left-to-right while the colour moves gold -> forest.
 *
 * Only the label is underlined; the arrow sits outside it and shifts instead.
 */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "meta group inline-flex items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="link-underline">{children}</span>
      <span
        aria-hidden="true"
        className="text-gold transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-forest"
      >
        &rarr;
      </span>
    </Link>
  );
}
