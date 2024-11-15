import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

export default [
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  pluginJs.configs.recommended,
  {
	plugins: {
	  jest: jest,
	}
  },
  {
	ignores: ['dist/']
  },
  {
	rules: {
	  'no-unused-vars': ['error', { 'varsIgnorePattern': '^[A-Z]' }],
	}
  }
];