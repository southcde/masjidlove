import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Native projects and the web assets Capacitor copies into them.
    "android/**",
    "ios/**",
    // Claude Design canvas runtime — reference tooling, not app code.
    "support.js",
    "image-slot.js",
  ]),
]);

export default eslintConfig;
