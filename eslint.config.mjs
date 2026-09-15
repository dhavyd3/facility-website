import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships native flat configs, so they are spread
 * directly. (`next lint` no longer exists in Next 16 — `npm run lint` calls
 * eslint itself, after the design-rule and message-parity guards.)
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "prisma/generated/**", "out/**"] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
