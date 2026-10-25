<<<<<<< Updated upstream
import css from "@eslint/css";
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
import js from "@eslint/js";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
<<<<<<< Updated upstream
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
  {
=======
=======
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
  {
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87
>>>>>>> Stashed changes
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.json"],
<<<<<<< Updated upstream
    ignores: ["package-lock.json", "tsconfig.json"],
=======
<<<<<<< HEAD
=======
    ignores: ["package-lock.json", "tsconfig.json"],
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87
>>>>>>> Stashed changes
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
<<<<<<< Updated upstream
    rules: {
      "css/no-invalid-properties": "off",
    },
=======
<<<<<<< HEAD
=======
    rules: {
      "css/no-invalid-properties": "off",
    },
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87
>>>>>>> Stashed changes
  },
  {
    rules: {
      "no-console": "error",
    },
  },
<<<<<<< Updated upstream
  // eslint-config-prettier must be last to disable conflicting rules
  eslintConfigPrettier,
=======
<<<<<<< HEAD
=======
  // eslint-config-prettier must be last to disable conflicting rules
  eslintConfigPrettier,
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87
>>>>>>> Stashed changes
]);
