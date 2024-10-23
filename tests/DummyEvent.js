import { RunBuilder } from "../src/Run";
import { v4 as uuidv4 } from 'uuid';
import {
  RunFacetsBuilder,
  ErrorMessage,
  ExternalQuery,
  NominalTime
} from "../src/facets/RunFacets";
import { JobBuilder } from "../src/Job";
import {
  JobFacetsBuilder,
  JobType,
  Documentation,
  Ownership,
  Owner,
  SourceCode,
  SourceCodeLocation,
  Sql
} from "../src/facets/JobFacets";
import {
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
} from "../src/facets/DatasetFacets";
import { TransformationType, FieldTransformationType, EventType } from "../src/types";
import {
  ColumnMetrics,
  DataQualityMetrics,
  InputDatasetFacets
} from "../src/facets/InputDatasetFacets";
import { InputDatasetBuilder } from "../src/InputDataset";
import { OutputDatasetBuilder } from "../src/OutputDataset";
import {
  OutputDatasetFacets,
  OutputStatistics
} from "../src/facets/OutputDatasetFacets";
import { RunEventBuilder } from "../src/events/RunEvent";
import { JobEventBuilder } from "../src/events/JobEvent";
import { DatasetEventBuilder } from "../src/events/DatasetEvent";
const producer = 'https://example.com/producer';
const schemaURL = 'https://example.com/schema';


function generateNewRun(){
  return new RunBuilder()
  .setRunId(uuidv4())
  .addRunFacets(new RunFacetsBuilder()
  .setErrorMessage(
	  new ErrorMessage(producer, schemaURL, 'error message', 'js',
		  'stack trace'))
  .setExternalQuery(new ExternalQuery(producer, schemaURL, '5d', 'source'))
  .setNominalTime(
	  new NominalTime(producer, schemaURL, '2020-12-17T03:00:00.000Z',
		  '2020-12-17T03:05:00.000Z'))
  .build())
  .build();
}

function generateNewJob(name, namespace) {
  return new JobBuilder()
  .setName(name)
  .setNamespace(namespace)
  .addFacets(new JobFacetsBuilder()
  .setJobType(
	  new JobType(producer, schemaURL, 'STREAMING', 'integration', 'job'))
  .setDocumentation(new Documentation(producer, schemaURL, 'description'))
  .setOwnership(new Ownership(producer, schemaURL,
	  [new Owner('owner name', 'for example Maintainer')]))
  .setSourceCode(
	  new SourceCode(producer, schemaURL, 'javascript', 'console.log(test)'))
  .setSourceCodeLocation(
	  new SourceCodeLocation(producer, schemaURL, 'git|svn', 'https://exampleurl.com',
		  'https://exampleRepoUrl.com', 'path', 'version', 'tag', 'main', false))
  .setSql(new Sql(producer, schemaURL, 'SELECT', true))
  .build())
  .build();
}

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
.setDataSource(new DataSource(producer, schemaURL, 'source', 'https://example.com'))
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




function generateDummyRunEvent(type, job) {
  const run = generateNewRun();
  return new RunEventBuilder(new Date().toISOString(), producer,
	  schemaURL, type)
  .setRun(run)
  .setJob(job)
  .setInputs([inputDataset])
  .setOutputs([outputDataset])
  .build();
}

function generateDummyJobEvent(name, namespace) {
  return new JobEventBuilder(new Date().toISOString(), producer,
	  schemaURL)
  .setJob(generateNewJob(name, namespace))
  .setInputs([inputDataset])
  .setOutputs([outputDataset])
  .build();
}

function generateDummyDatasetEvent() {
  return new DatasetEventBuilder(new Date().toISOString(), producer, schemaURL)
  .setDataset(inputDataset)
  .build();
}

export { generateDummyRunEvent, generateDummyDatasetEvent, generateDummyJobEvent, generateNewRun, generateNewJob};