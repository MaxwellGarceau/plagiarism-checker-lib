import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
	},
	{
		ignores: ["node_modules/**", "dist/**", "coverage/**"],
	},
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser,
		},
		rules: {
			// Enforce tabs
			"@/indent": ["error", "tab"],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
