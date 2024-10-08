const {RunBuilder} = require("../src/Run");
const {
  RunFacetsBuilder,
  ErrorMessage,
  Parent,
  ExternalQuery,
  NominalTime
} = require("../src/facets/RunFacets");
const {JobBuilder} = require("../src/Job");
const {
  JobFacetsBuilder,
  JobType,
  Documentation,
  Ownership,
  Owner,
  SourceCode,
  SourceCodeLocation,
  Sql
} = require("../src/facets/JobFacets");
const {
  Item,
  Transformation,
  Field,
  ColumnLineage,
  DatasetFacetsBuilder,
  Schema,
  SchemaDatasetFacetFields,
  DataSource,
  DataQualityAssertions,
  Assertion,
  LifecycleStateChange,
  PreviousIdentifier,
  Storage,
  Symlinks,
  Identifier,
  Version
} = require("../src/facets/DatasetFacets");
const {TransformationType, FieldTransformationType, EventType} = require("../src/types");
const {ColumnMetrics, DataQualityMetrics, InputDatasetFacets} = require(
	"../src/facets/InputDatasetFacets");
const {InputDatasetBuilder} = require("../src/InputDataset");
const {OutputDatasetBuilder} = require("../src/OutputDataset");
const {OutputDatasetFacets, OutputStatistics} = require(
	"../src/facets/OutputDatasetFacets");
const { RunEventBuilder } = require("../src/events/RunEvent");
const { JobEventBuilder } = require("../src/events/JobEvent");
const { DatasetEventBuilder } = require("../src/events/DatasetEvent");
const producer = 'https://example.com/producer';
const schemaURL = 'https://example.com/schema';

// Create a Run instance
const run = new RunBuilder()
.setRunId('123e4567-e89b-12d3-a456-426614174000')
.addRunFacets(new RunFacetsBuilder()
.setErrorMessage(
	new ErrorMessage(producer, schemaURL, 'error message', 'js',
		'stack trace'))
.setParent(new Parent(producer, schemaURL, 'job name', 'job namespace',
	'123e4567-e89b-12d3-a456-426614174001'))
.setExternalQuery(new ExternalQuery(producer, schemaURL, '5d', 'source'))
.setNominalTime(
	new NominalTime(producer, schemaURL, '2020-12-17T03:00:00.000Z',
		'2020-12-17T03:05:00.000Z'))
.build())
.build();

// Create a Job instance
const job = new JobBuilder()
.setName('jobName')
.setNamespace('namespace')
.addFacets(new JobFacetsBuilder()
.setJobType(
	new JobType(producer, schemaURL, 'STREAMING', 'integration', 'job'))
.setDocumentation(new Documentation(producer, schemaURL, 'description'))
.setOwnership(new Ownership(producer, schemaURL,
	[new Owner('owner name', 'for example Maintainer')]))
.setSourceCode(
	new SourceCode(producer, schemaURL, 'javascript', 'console.log(test)'))
.setSourceCodeLocation(
	new SourceCodeLocation(producer, schemaURL, 'git|svn', 'url',
		'repo url', 'path', 'version', 'tag', 'main', false))
.setSql(new Sql(producer, schemaURL, 'SELECT', true))
.build())
.build()

// Create a ColumnLineage instance
const item = new Item('namespace', 'name', 'field',
	[new Transformation(TransformationType.DIRECT)]);
const field = new Field([item], 'description',
	FieldTransformationType.IDENTITY);
const columnLineage = new ColumnLineage(producer, schemaURL);
columnLineage.addField('key', field);

// Create a DatasetFacets instance
const datasetFacets = new DatasetFacetsBuilder()
.setOwnership(new Ownership(producer, schemaURL,
	[new Owner('owner name', 'for example Maintainer')]))
.setColumnLineage(columnLineage)
.setSchema(new Schema(producer, schemaURL,
	[new SchemaDatasetFacetFields('field', 'type', 'description')]))
.setDataSource(new DataSource(producer, schemaURL, 'source', 'connection'))
.setDataQualityAssertions(new DataQualityAssertions(producer, schemaURL,
	[new Assertion('asserton name', true, 'assertion')]))
.setLifecycleStateChange(
	new LifecycleStateChange(producer, schemaURL, 'life cycle state',
		new PreviousIdentifier('name', 'namespace')))
.setSchema(new Schema(producer, schemaURL,
	[new SchemaDatasetFacetFields('field', 'type', 'description')]))
.setStorage(new Storage(producer, schemaURL, 'storage', 'format'))
.setSymlinks(new Symlinks(producer, schemaURL,
	[new Identifier('name', 'namespace', 'type')]))
.setVersion(new Version(producer, schemaURL, 'version'))
.build()

//create DataQualityMetrics
const columnMetrics = new ColumnMetrics(1, 2, 3, 4, 5, 6, {});
columnMetrics.addQuantile('first', 10);
const dataQualityMetrics = new DataQualityMetrics(producer, schemaURL,
	columnMetrics, 1, 2, 3);

//create input datasets
const inputDataset = new InputDatasetBuilder()
.setName('inputDatasetName')
.setNamespace('inputDatasetNamespace')
.setFacets(datasetFacets)
.setInputFacets(new InputDatasetFacets(dataQualityMetrics))
.build();

const outputDataset = new OutputDatasetBuilder()
.setName('outputDatasetName')
.setNamespace('outputDatasetNamespace')
.setOutputFacet(new OutputDatasetFacets(
	new OutputStatistics(producer, schemaURL, 1, 2, 3)))
.setFacets(datasetFacets)
.build();


function getDummyRunEvent() {
  return new RunEventBuilder(new Date().toISOString(), producer,
	  schemaURL, EventType.START)
  .setRun(run)
  .setJob(job)
  .setInputs([inputDataset])
  .setOutputs([outputDataset])
  .build();
}

function getDummyJobEvent() {
  return new JobEventBuilder(new Date().toISOString(), producer,
	  schemaURL)
  .setJob(job)
  .setInputs([inputDataset])
  .setOutputs([outputDataset])
  .build();
}

function getDummyDatasetEvent() {
  return new DatasetEventBuilder(new Date().toISOString(), producer, schemaURL)
  .setDataset(inputDataset)
  .build();
}

module.exports = {
  getDummyRunEvent, getDummyDatasetEvent, getDummyJobEvent
};