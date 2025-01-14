import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

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
			globals: {
				...globals.browser, ...globals.node,
			}
		},
		rules: {
			// Enforce tabs
			"@/indent": ["error", "tab"],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
