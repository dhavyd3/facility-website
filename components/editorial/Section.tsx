import type { ReactNode } from "react";
import { Meta } from "@/components/ui/Meta";

/**
 * A ruled editorial section: hairline above, eyebrow label, display heading.
 * `tone` switches the ground; `.on-dark` / `.on-forest` retarget every label
 * tone to its dark-ground step automatically (see globals.css).
 */
export function Section({
  eyebrow,
  title,
  intro,
  children,
  tone = "cream",
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "cream" | "champagne" | "dark" | "forest";
  id?: string;
}) {
  const ground = {
    cream: "",
    champagne: "bg-champagne",
    dark: "on-dark",
    forest: "on-forest",
  }[tone];

  return (
    <section id={id} className={`${ground} py-24 md:py-32`}>
      <div className="shell">
        {(eyebrow || title) && (
          <header className="reveal max-w-4xl">
            {eyebrow && <Meta tone="accent">{eyebrow}</Meta>}
            {title && <h2 className="display display-lg mt-6">{title}</h2>}
            {intro && (
              <p className="prose-measure mt-7 text-lg opacity-80">{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
