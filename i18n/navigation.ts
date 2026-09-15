import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Always import Link from here rather than
 * next/link, so switching language preserves the current route.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
