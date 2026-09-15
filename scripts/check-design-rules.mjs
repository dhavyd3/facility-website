#!/usr/bin/env node
/**
 * Guard for the two non-negotiable design rules.
 *
 * RULE 1  No leading-edge accent bars on cards, tiles, panels, rows or
 *         callouts: no border-left / border-inline-start accent, no
 *         horizontal-only inset box-shadow, no absolutely-positioned
 *         leading-edge strip. Status and selection ride on the border colour
 *         the element already has, a surface tint, or the text itself.
 *         Allowed: nav active markers, quote/speaker rules in running text.
 *
 *         The strip detector keys on SHAPE, because the same ::before
 *         machinery builds things we do want. A pseudo-element pinned to the
 *         inline start that is NARROW and FULL HEIGHT is an edge bar, and is
 *         rejected. One pinned to the bottom that is FULL WIDTH and SHORT is
 *         an underline, and one inset on all sides is a fill sweep - both are
 *         allowed. Without that distinction this guard would block the hover
 *         animations it sits alongside.
 *
 * RULE 2  Non-interactive labels are plain text with the meaning in the
 *         text colour. No pill or filled/bordered capsule, no padding that
 *         implies a hit area. Capsules belong only to things you can press:
 *         Button, FilterChip, Tab, switches, inputs.
 *         Corollary: label colour must be a TEXT-SAFE step of the role, so
 *         the decorative --gold-rule (2.91:1 on cream) can never be text.
 *
 * Escape hatch, per line:  design-rule-allow: <reason>
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_EXT = new Set([".css", ".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIR = new Set([
  "node_modules", ".next", ".git", "out", "build", "generated", "public",
]);

/** Files permitted to build a capsule, because their job is interactivity. */
const CAPSULE_OK = [
  "components/ui/Button.tsx",
  "components/ui/FilterChip.tsx",
  "components/ui/Tab.tsx",
  "components/ui/Field.tsx",
  "components/ui/Switch.tsx",
];

/** Files permitted a leading-edge rule: nav markers and running-text quotes. */
const EDGE_RULE_OK = [
  "components/nav/",
  "components/editorial/Quote.tsx",
];

const ALLOW = /design-rule-allow:/;
const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      if (!SKIP_DIR.has(entry)) walk(abs);
    } else if (SCAN_EXT.has(entry.slice(entry.lastIndexOf(".")))) {
      inspect(abs);
    }
  }
}

const isSelf = (rel) => rel === join("scripts", "check-design-rules.mjs");
const startsWithAny = (rel, list) =>
  list.some((p) => rel.split(sep).join("/").startsWith(p));

/** Narrow enough that the element reads as a bar rather than a surface. */
const NARROW = /^(?:0?\.\d+|[1-8])(?:px|rem)?$/;

const declMap = (body) => {
  const out = new Map();
  for (const decl of body.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    out.set(
      decl.slice(0, i).trim().toLowerCase(),
      decl.slice(i + 1).trim().toLowerCase(),
    );
  }
  return out;
};

/**
 * Rule 1, shape-based: walk every ::before/::after rule body and reject only
 * the narrow full-height strip pinned to the inline start.
 */
function inspectCssBlocks(rel, text, edgeOk) {
  if (edgeOk) return;
  const RULE = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = RULE.exec(text)) !== null) {
    const selector = m[1];
    const body = m[2];
    if (!/::(?:before|after)\b/.test(selector)) continue;
    if (ALLOW.test(selector) || ALLOW.test(body)) continue;

    const d = declMap(body);
    const pos = d.get("position");
    if (pos !== "absolute" && pos !== "fixed") continue;

    const startPinned =
      d.get("left") === "0" ||
      d.get("inset-inline-start") === "0" ||
      d.has("inset-inline") ||
      d.get("inset") === "0";
    if (!startPinned) continue;

    // Pinned at both inline edges (or fully inset) means a surface, not a bar.
    const endPinned =
      d.get("right") === "0" ||
      d.get("inset-inline-end") === "0" ||
      d.has("inset-inline") ||
      d.get("inset") === "0";

    const width = d.get("width");
    const isNarrow = width !== undefined && NARROW.test(width);
    const fullHeight =
      d.get("height") === "100%" ||
      d.get("inset-block") === "0" ||
      (d.get("top") === "0" && d.get("bottom") === "0") ||
      d.get("inset") === "0";

    if (isNarrow && fullHeight && !endPinned) {
      const line = text.slice(0, m.index).split("\n").length;
      findings.push({
        rule: "1",
        file: rel,
        line,
        msg: "narrow full-height pseudo-element pinned to the inline start - an edge bar",
        src: selector.trim() + " { width: " + width + "; ... }",
      });
    }
  }
}

function inspect(abs) {
  const rel = relative(ROOT, abs);
  if (isSelf(rel)) return;
  const posix = rel.split(sep).join("/");
  const text = readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);
  const edgeOk = startsWithAny(rel, EDGE_RULE_OK);
  const capsuleOk = CAPSULE_OK.includes(posix);

  inspectCssBlocks(posix, text, edgeOk);

  lines.forEach((line, i) => {
    if (ALLOW.test(line)) return;
    const at = (rule, msg) =>
      findings.push({ rule, file: posix, line: i + 1, msg, src: line.trim() });

    // ---- RULE 1: CSS leading-edge accents -------------------------------
    if (!edgeOk) {
      if (/border-(?:left|inline-start)\s*:\s*(?!none|0)/.test(line)) {
        at("1", "border-left/inline-start accent on a page component");
      }
      if (/border-(?:left|inline-start)-color\s*:/.test(line)) {
        at("1", "border-left-color accent on a page component");
      }
      // inset shadow with a horizontal offset but no vertical/blur spread
      if (/box-shadow\s*:[^;]*inset\s+-?\d*\.?\d+(?:px|rem|em)\s+0\s+0\s/.test(line)) {
        at("1", "horizontal-only inset box-shadow imitating an edge bar");
      }
      // ---- RULE 1: Tailwind leading-edge accents ------------------------
      if (/\bborder-(?:l|s)-(?:[1-9]\d*|\[)/.test(line)) {
        at("1", "Tailwind border-l/border-s width - an edge accent bar");
      }
      if (/\bborder-(?:l|s)-(?:gold|espresso|forest|champagne|ink|red|amber|green|blue|\[)/.test(line)) {
        at("1", "Tailwind coloured border-l/border-s - an edge accent bar");
      }
      // Same shape, expressed as Tailwind pseudo-variants.
      if (
        /\b(?:before|after):absolute\b/.test(line) &&
        /\b(?:before|after):(?:left-0|inset-y-0|start-0)\b/.test(line) &&
        /\b(?:before|after):w-(?:px|0\.5|1|1\.5|2|\[[0-8](?:px|rem)\])\b/.test(line) &&
        !/\b(?:before|after):(?:right-0|inset-x-0|end-0)\b/.test(line)
      ) {
        at("1", "narrow full-height pseudo-element pinned to the inline start - an edge bar");
      }
    }

    // ---- RULE 2 corollary: decorative gold used as text -----------------
    if (/(^|[^-\w])color\s*:\s*[^;]*--gold-rule/.test(line)) {
      at("2", "--gold-rule as a text colour (2.91:1 on cream - fails AA)");
    }
    if (/\btext-\[var\(--gold-rule/.test(line) || /\btext-gold-rule\b/.test(line)) {
      at("2", "--gold-rule as a text colour (2.91:1 on cream - fails AA)");
    }

    // ---- RULE 2: capsule around a non-interactive label ----------------
    if (!capsuleOk && /<(?:span|div|p|li)\b[^>]*className=/.test(line)) {
      const hasRadius = /\brounded(?:-|\b)/.test(line);
      const hasPad = /\bp[xy]?-\d/.test(line);
      const hasFill = /\bbg-(?!transparent)\w/.test(line) || /\bborder\b(?!-0)/.test(line);
      if (hasRadius && hasPad && hasFill) {
        at("2", "capsule (radius + padding + fill/border) on a non-interactive element");
      }
    }
  });
}

walk(ROOT);

if (findings.length === 0) {
  console.log("design-rules: clean");
  process.exit(0);
}

const RULE_TITLE = {
  1: "Rule 1 - no leading-edge accent bars",
  2: "Rule 2 - no capsules on non-interactive labels",
};

console.error("\ndesign-rules: " + findings.length + " violation(s)\n");
for (const rule of ["1", "2"]) {
  const group = findings.filter((f) => f.rule === rule);
  if (!group.length) continue;
  console.error(RULE_TITLE[rule]);
  for (const f of group) {
    console.error("  " + f.file + ":" + f.line + "  " + f.msg);
    console.error("    " + f.src);
  }
  console.error("");
}
console.error(
  "Fix by carrying meaning in the border colour the element already has, a\n" +
  "surface tint, or the text itself. Render labels with <Meta>. If a line is a\n" +
  "genuine exception (nav active marker, quote rule), append the comment:\n" +
  "design-rule-allow: <reason>\n"
);
process.exit(1);
