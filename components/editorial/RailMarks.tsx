/**
 * The rail's drawn parts, as SVG.
 *
 * Geometry inside each SVG is fixed in CSS pixels and there is deliberately
 * NO viewBox: a viewBox with preserveAspectRatio="none" would scale
 * non-uniformly with row height and stretch the dash-dot rhythm out of shape.
 * Position comes from CSS (the --i / --rail-step staircase) instead.
 *
 * Dash pattern measured from the reference recording: dash 17, gap 6, dot 3,
 * gap 6, at a 2px stroke.
 */

const M = 16; // marker box, must match --rail-marker
const C = M / 2; // centre line
const R = 5; // diamond radius

/** Hollow until the service is reached, then filled — see globals.css. */
export function RailDiamond() {
  return (
    <svg className="rail__marker" width={M} height={M} aria-hidden="true">
      <path
        className="rail-diamond"
        d={`M ${C} ${C - R} L ${C + R} ${C} L ${C} ${C + R} L ${C - R} ${C} Z`}
      />
    </svg>
  );
}

/**
 * Terminal for the last service: a filled diamond plus an arrowhead. This is
 * the motif already used on the Facility logo, where the rule either side of
 * "COACHING · EVENTS · SERVICES" ends in arrowheads.
 */
export function RailTerminal() {
  return (
    <svg className="rail__marker" width={M * 2} height={M} aria-hidden="true">
      <path
        className="rail-arrow"
        d={`M ${C} ${C - R} L ${C + R} ${C} L ${C} ${C + R} L ${C - R} ${C} Z`}
      />
      <path
        className="rail-arrow"
        d={`M ${C + R + 1} ${C - R} L ${C + R + 1 + R * 1.6} ${C} L ${C + R + 1} ${C + R} Z`}
      />
    </svg>
  );
}

/** The vertical segment that grows with scroll; clipped by --p in CSS. */
export function RailLine() {
  return (
    <svg className="rail__vline" width={M} aria-hidden="true">
      <line className="rail-stroke" x1={C} y1="0" x2={C} y2="100%" />
    </svg>
  );
}

/** The horizontal step that joins the previous column to this marker. */
export function RailConnector() {
  return (
    <svg className="rail__connector" height={M} aria-hidden="true">
      <line className="rail-stroke" x1={C} y1={C} x2="100%" y2={C} />
    </svg>
  );
}
