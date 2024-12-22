import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // Match all JS and TS files
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: "latest", // Use latest ECMAScript features
        sourceType: "module", // Enable ESM
        ecmaFeatures: {
          jsx: true, // Enable JSX support
        },
      },
      globals: {
        ...globals.browser, // Add browser globals (e.g., window, document)
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // JavaScript recommended rules
      ...tseslint.configs.recommended.rules, // TypeScript recommended rules
      ...pluginReact.configs.recommended.rules, // React recommended rules
      ...pluginReactHooks.configs.recommended.rules, // React Hooks recommended rules
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "@typescript-eslint/no-unused-vars": ["warn"], // Warn for unused variables
      "react-hooks/rules-of-hooks": "error", // Enforce hook rules
      "react-hooks/exhaustive-deps": "warn", // Warn for missing dependencies in hooks
    },
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  },
];
