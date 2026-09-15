import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/site.config";

/**
 * The lockup is two separate images, laid out the way the original single
 * image arranged them: the F mark, then the wordmark to its right.
 *
 * They were split so the wordmark can be sized on its own. In the combined
 * image the tagline was about 2.7px tall at header size and unreadable. Here
 * the wordmark is 0.86 of the mark height (the old image used 0.68), which
 * brings "MAKE YOUR LIFE EASY" to about 4px at 1x and 8px on retina screens.
 *
 * `light` sits on cream. `dark` is recoloured from the light parts for
 * espresso/forest grounds: the F strokes and the wordmark move to the
 * gold-on-dark step, and the filigree is softened so it stays as quiet as it
 * is on cream.
 *
 * Sizes live in globals.css (.logo-lockup) as a single --logo-h variable, so
 * the two images always scale together.
 */
const MARK = { width: 245, height: 158 };
const WORDMARK = { width: 348, height: 116 };

export function Logo({
  theme = "light",
  size = "header",
  priority = false,
}: {
  theme?: "light" | "dark";
  size?: "header" | "footer";
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`logo-lockup logo-lockup--${size}`}
      aria-label={site.name}
    >
      {/* Decorative: the link itself carries the accessible name. */}
      <Image
        src={`/brand/facility-mark-${theme}.png`}
        alt=""
        width={MARK.width}
        height={MARK.height}
        priority={priority}
        className="logo-lockup__mark"
      />
      <Image
        src={`/brand/facility-wordmark-${theme}.png`}
        alt=""
        width={WORDMARK.width}
        height={WORDMARK.height}
        priority={priority}
        className="logo-lockup__text"
      />
    </Link>
  );
}
