import { v4 as uuidv4 } from 'uuid';
import {
  Assertion,
  ColumnLineage,
  ColumnMetrics,
  DataQualityAssertions,
  DataQualityMetrics,
  DatasetEventBuilder,
  DatasetFacetsBuilder,
  DataSource,
  Documentation,
  ErrorMessage,
  EventType,
  ExternalQuery,
  Field,
  FieldTransformationType,
  Identifier,
  InputDatasetBuilder,
  InputDatasetFacets,
  Item,
  JobBuilder,
  JobEventBuilder,
  JobFacetsBuilder,
  JobType,
  LifecycleStateChange,
  NominalTime,
  OutputDatasetBuilder,
  OutputDatasetFacets,
  OutputStatistics,
  Owner,
  Ownership,
  PreviousIdentifier,
  ProcessingType,
  RunBuilder,
  RunEventBuilder,
  RunFacetsBuilder,
  Schema,
  SchemaDatasetFacetFields,
  SourceCode,
  SourceCodeLocation,
  Sql,
  Storage,
  Symlinks,
  Transformation,
  TransformationType,
  Version,
  Job,
} from '../../src';

export class DummyEvent {
  private producer: string;
  private schemaURL: string;

  constructor(producer: string, schemaURL: string) {
    this.producer = producer;
    this.schemaURL = schemaURL;
  }

  /**
   * Generates a new Run instance with facets.
   */
  generateNewRun() {
    return new RunBuilder()
    .setRunId(uuidv4())
    .addRunFacets(
      new RunFacetsBuilder()
      .setErrorMessage(new ErrorMessage(this.producer, this.schemaURL, "error message", "js", "stack trace"))
      .setExternalQuery(new ExternalQuery(this.producer, this.schemaURL, "5d", "source"))
      .setNominalTime(new NominalTime(this.producer, this.schemaURL, "2020-12-17T03:00:00.000Z", "2020-12-17T03:05:00.000Z"))
      .build()
    )
    .build();
  }

  /**
   * Generates a new Job instance with facets.
   */
  generateNewJob(name: string, namespace: string) {
    return new JobBuilder()
    .setName(name)
    .setNamespace(namespace)
    .addFacets(
      new JobFacetsBuilder()
      .setJobType(new JobType(this.producer, this.schemaURL, ProcessingType.STREAMING, "integration", "job"))
      .setDocumentation(new Documentation(this.producer, this.schemaURL, "description"))
      .setOwnership(new Ownership(this.producer, this.schemaURL, [new Owner("owner name", "for example Maintainer")]))
      .setSourceCode(new SourceCode(this.producer, this.schemaURL, "javascript", "console.log(test)"))
      .setSourceCodeLocation(
        new SourceCodeLocation(
          this.producer,
          this.schemaURL,
          "git|svn",
          "https://exampleurl.com",
          "https://exampleRepoUrl.com",
          "path",
          "version",
          "tag",
          "main",
          false
        )
      )
      .setSql(new Sql(this.producer, this.schemaURL, "SELECT", true))
      .build()
    )
    .build();
  }

  /**
   * Generates a DatasetFacets instance.
   */
  generateDatasetFacets() {
    const columnLineage = new ColumnLineage(this.producer, this.schemaURL);

    const item = new Item("namespace", "name", "field", [new Transformation(TransformationType.DIRECT)]);
    const field = new Field([item], "description", FieldTransformationType.IDENTITY);
    columnLineage.addField("key", field);

    return new DatasetFacetsBuilder()
    .setOwnership(new Ownership(this.producer, this.schemaURL, [new Owner("owner name", "for example Maintainer")]))
    .setColumnLineage(columnLineage)
    .setSchema(new Schema(this.producer, this.schemaURL, [new SchemaDatasetFacetFields("field", "type", "description")]))
    .setDataSource(new DataSource(this.producer, this.schemaURL, "source", "https://example.com"))
    .setDataQualityAssertions(
      new DataQualityAssertions(this.producer, this.schemaURL, [new Assertion("assertion name", true, "assertion")])
    )
    .setLifecycleStateChange(
      new LifecycleStateChange(this.producer, this.schemaURL, "life cycle state", new PreviousIdentifier("name", "namespace"))
    )
    .setStorage(new Storage(this.producer, this.schemaURL, "storage", "format"))
    .setSymlinks(new Symlinks(this.producer, this.schemaURL, [new Identifier("name", "namespace", "type")]))
    .setVersion(new Version(this.producer, this.schemaURL, "version"))
    .build();
  }

  /**
   * Generates an InputDataset instance.
   */
  generateInputDataset() {
    const datasetFacets = this.generateDatasetFacets();
    const columnMetrics = new ColumnMetrics(1, 2, 3, 4, 5, 6, {});
    columnMetrics.addQuantile("first", 10);
    const dataQualityMetrics = new DataQualityMetrics(this.producer, this.schemaURL, {}, 1, 2, 3);
    dataQualityMetrics.addColumnMetrics("key", columnMetrics);

    return new InputDatasetBuilder()
    .setName("inputDatasetName")
    .setNamespace("inputDatasetNamespace")
    .setFacets(datasetFacets)
    .setInputFacets(new InputDatasetFacets(dataQualityMetrics))
    .build();
  }

  /**
   * Generates an OutputDataset instance.
   */
  generateOutputDataset() {
    const datasetFacets = this.generateDatasetFacets();

    return new OutputDatasetBuilder()
    .setName("outputDatasetName")
    .setNamespace("outputDatasetNamespace")
    .setOutputFacets(new OutputDatasetFacets(new OutputStatistics(this.producer, this.schemaURL, 1, 2, 3)))
    .setFacets(datasetFacets)
    .build();
  }

  /**
   * Generates a RunEvent instance.
   */
  generateDummyRunEvent(type: string, job: Job) {
    const run = this.generateNewRun();
    const inputDataset = this.generateInputDataset();
    const outputDataset = this.generateOutputDataset();

    return new RunEventBuilder(new Date().toISOString(), this.producer, this.schemaURL, EventType.RUNNING)
    .setRun(run)
    .setJob(job)
    .setInputs([inputDataset])
    .setOutputs([outputDataset])
    .build();
  }

  /**
   * Generates a JobEvent instance.
   */
  generateDummyJobEvent(name: string, namespace: string) {
    const job = this.generateNewJob(name, namespace);
    const inputDataset = this.generateInputDataset();
    const outputDataset = this.generateOutputDataset();

    return new JobEventBuilder(new Date().toISOString(), this.producer, this.schemaURL)
    .setJob(job)
    .setInputs([inputDataset])
    .setOutputs([outputDataset])
    .build();
  }

  /**
   * Generates a DatasetEvent instance.
   */
  generateDummyDatasetEvent() {
    const inputDataset = this.generateInputDataset();

    return new DatasetEventBuilder(new Date().toISOString(), this.producer, this.schemaURL)
    .setDataset(inputDataset)
    .build();
  }
}