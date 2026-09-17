import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default [
  // Ignore build output and dependencies.
  { ignores: ["dist", "node_modules"] },

  // Base JS recommended rules.
  js.configs.recommended,

  // React rules for all source files.
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules, // no need to import React for JSX
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off", // this project does not use prop-types
      // Allow props pulled out of a {...rest} spread that aren't otherwise used
      // (e.g. TextField extracts `label`/`labelClassName` so they don't leak to the DOM).
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Node globals for config files at the repo root.
  {
    files: ["*.config.js", "vite.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },

  // Turn off ESLint rules that would conflict with Prettier formatting.
  prettier,
];
