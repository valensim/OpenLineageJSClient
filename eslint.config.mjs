import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

export default [
  {languageOptions: {globals: {...globals.node, ...globals.jest}}},
  pluginJs.configs.recommended,
  {
	plugins: {
	  jest: jest
	}
  },
  {
	ignores: ['dist/']
  },
  {
	rules: {
	  // lot of unused vars need to be ignored they are only used in the JSDoc
	  'no-unused-vars': ['error', { 'varsIgnorePattern': '^(BaseEvent|Transport|RunFacets|OutputDatasetFacets|DatasetFacets|JobFacets|TransformationType|FieldTransformationType|EventType|Run|OutputDataset|Job|InputDataset|Dataset|InputDatasetFacets|_)$' }]
	}
  }
];