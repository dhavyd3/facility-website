#!/usr/bin/env node
/**
 * Both locales must carry exactly the same keys. A missing key renders as a
 * raw key string in production, which is the kind of thing nobody notices in
 * the locale they don't read.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "messages";
const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));

const flatten = (obj, prefix = "", out = new Map()) => {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, path, out);
    else out.set(path, v);
  }
  return out;
};

const sets = files.map((f) => ({
  locale: f.replace(/\.json$/, ""),
  keys: flatten(JSON.parse(readFileSync(join(DIR, f), "utf8"))),
}));

const [base, ...rest] = sets;
let failed = false;

for (const other of rest) {
  for (const k of base.keys.keys()) {
    if (!other.keys.has(k)) {
      console.error(`messages: "${k}" present in ${base.locale}, missing in ${other.locale}`);
      failed = true;
    }
  }
  for (const k of other.keys.keys()) {
    if (!base.keys.has(k)) {
      console.error(`messages: "${k}" present in ${other.locale}, missing in ${base.locale}`);
      failed = true;
    }
  }
}

// An empty string is almost always an unfinished translation.
for (const s of sets) {
  for (const [k, v] of s.keys) {
    if (typeof v === "string" && v.trim() === "") {
      console.error(`messages: "${k}" is empty in ${s.locale}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`messages: ${base.keys.size} keys, ${sets.length} locales in sync`);
