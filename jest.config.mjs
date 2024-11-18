export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
	'default',
	['jest-junit', { outputDirectory: '.', outputName: 'report.xml' }]
  ],
  transform: {
	"^.+\\.js?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "mjs"],
  testEnvironment: "node",
  moduleNameMapper: {
	'^(\\.{1,2}/.*)\\.js$': '\$1',
  },
  transformIgnorePatterns: [
	"node_modules/(?!(open-lineage-client-js)/)"
  ]
};