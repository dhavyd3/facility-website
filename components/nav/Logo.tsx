import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/site.config";

/**
 * The supplied PNGs were 500x500 with only 446x132 of actual artwork, so they
 * are cropped to content in public/brand — same display size, far more of the
 * pixels doing work. `light` sits on cream, `dark` on espresso/forest.
 *
 * An SVG is still on the open-items list for large display; at header size the
 * cropped raster is comfortably past 2x.
 */
export function Logo({
  theme = "light",
  width = 150,
  variant = "lockup",
  priority = false,
}: {
  theme?: "light" | "dark";
  width?: number;
  variant?: "lockup" | "emblem" | "wordmark";
  priority?: boolean;
}) {
  const ratio = { lockup: 140 / 454, emblem: 140 / 178, wordmark: 140 / 280 }[
    variant
  ];

  return (
    <Link href="/" className="inline-flex items-center" aria-label={site.name}>
      <Image
        src={`/brand/facility-${variant}-${theme}.png`}
        alt={site.name}
        width={width}
        height={Math.round(width * ratio)}
        priority={priority}
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
