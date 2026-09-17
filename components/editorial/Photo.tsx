import Image from "next/image";

/**
 * A photograph with a hairline mat laid over it, in one of two crops.
 *
 * `curtain` reveals it from the bottom instead of settling out of a slight
 * zoom; both animations live in globals.css (.photo) and are keyed on the
 * surrounding `.reveal` block, so the picture is simply there without JS.
 */
export function Photo({
  src,
  alt,
  aspect = "portrait",
  priority = false,
  curtain = false,
  sizes = "(min-width: 1024px) 45vw, 100vw",
}: {
  src: string;
  alt: string;
  aspect?: "portrait" | "wide";
  priority?: boolean;
  curtain?: boolean;
  sizes?: string;
}) {
  const classes = [
    "photo",
    aspect === "wide" && "photo--wide",
    curtain && "photo--curtain",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="photo__img">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} />
      </div>
      <span className="photo__mat" aria-hidden="true" />
    </div>
  );
}
