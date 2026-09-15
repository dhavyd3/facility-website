"use client";

import { useEffect } from "react";

/**
 * Adds `is-in` to every `.reveal` as it enters the viewport. One observer for
 * the whole document rather than one per component, and it re-scans after
 * navigation because App Router keeps this mounted across routes.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document
        .querySelectorAll(".reveal:not(.is-in)")
        .forEach((el) => observer.observe(el));
    };

    scan();

    // Catch nodes added by client navigation or lazy sections.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
