import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale routing. Next 16 renamed the `middleware` file convention to `proxy`;
 * the handler contract is unchanged, so next-intl's middleware slots straight in.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals and anything with a file extension.
  // The dot is double-escaped: in a plain string "\." collapses to ".", which
  // made the pattern skip every path longer than one character, so only "/"
  // ever got its French locale and /contact, /catalogue, ... 404'd.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
