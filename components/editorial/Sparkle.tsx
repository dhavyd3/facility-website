/**
 * The brand's "wow", drawn as a four-point glint. It stands in for an emoji:
 * the same wink of delight, but in the decorative gold and a line weight that
 * sits comfortably next to Bodoni.
 *
 * Decorative only. Painted from --gold-rule in globals.css (.sparkle), never
 * through `color`, so it can't be mistaken for a text colour by the guard.
 */
export function Sparkle({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={["sparkle", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="-8 -8 16 16"
      aria-hidden="true"
    >
      <path d="M0 -8 C1 -1 1 -1 8 0 C1 1 1 1 0 8 C-1 1 -1 1 -8 0 C-1 -1 -1 -1 0 -8 Z" />
    </svg>
  );
}
