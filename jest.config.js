module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
	'default',
	['jest-junit', { outputDirectory: '.', outputName: 'report.xml' }]
  ]
};