"use client";

import { useEffect } from "react";

/**
 * Drives the services rail from scroll position.
 *
 * For each row: p = (activationLine - rowTop) / rowHeight, clamped to 0..1.
 * That value is written to the row as `--p`, and globals.css clips the
 * dash-dot line to it, so the segment grows continuously toward the next
 * marker rather than snapping section to section — which is how the reference
 * behaves (measured 202px long at one scroll offset, 288px a second later
 * within the same section).
 *
 * A row the line has reached gets data-state="reached", filling its diamond.
 *
 * Deliberately driven by a requestAnimationFrame loop gated on an
 * IntersectionObserver, NOT by a scroll listener: Lenis smooth scrolling sits
 * between the user and the scroll position, and a `scroll` handler did not
 * fire reliably under it. The loop only runs while a row is actually on
 * screen, so it costs nothing the rest of the time.
 *
 * Server markup ships with --p:1 and data-state="reached", so with no JS or
 * under reduced motion the rail simply renders complete.
 */
const ACTIVATION = 0.45; // fraction of viewport height where a row "arrives"

export function RailProgress({
  selector = "[data-rail-row]",
}: {
  selector?: string;
}) {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (rows.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Leave the server's fully-drawn state exactly as it is.
      return;
    }

    let frame = 0;
    let running = false;
    const visible = new Set<Element>();

    const paint = () => {
      const line = window.innerHeight * ACTIVATION;

      for (const row of rows) {
        const rect = row.getBoundingClientRect();
        if (rect.height === 0) continue;

        const raw = (line - rect.top) / rect.height;
        const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;

        row.style.setProperty("--p", p.toFixed(4));
        row.dataset.state = raw >= 0 ? "reached" : "upcoming";
      }
    };

    const tick = () => {
      paint();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        if (visible.size > 0) start();
        else {
          stop();
          paint(); // settle on a correct final frame
        }
      },
      { rootMargin: "200px 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    paint();

    return () => {
      observer.disconnect();
      stop();
      // Hand the rail back fully drawn rather than frozen mid-animation.
      for (const row of rows) {
        row.style.removeProperty("--p");
        row.dataset.state = "reached";
      }
    };
  }, [selector]);

  return null;
}
