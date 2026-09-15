import type { ReactNode } from "react";

/**
 * The signature headline device, borrowed from The Nest: a roman headline with
 * the emphasis phrase in gold italic on the same line. Messages carry it as
 * <em>…</em> so translators can move the emphasis to where the sentence
 * actually stresses it — which differs between French and English.
 */
export const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Chunk handler set passed to next-intl's t.rich(). */
export const richTags = { em };
