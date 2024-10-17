const { getDummyRunEvent, generateNewJob} = require("./DummyEvent");
const { HttpTransport, HttpConfig } = require("../src/transport/http");
const {EventType} = require("../src/types");
const {OpenLineageClient} = require("../src/client");
const {InputDatasetBuilder} = require("../src/InputDataset");
const {OutputDatasetBuilder} = require("../src/OutputDataset");
const {JobBuilder} = require("../src/Job");
const {RunBuilder} = require("../src/Run");
const { v4: uuidv4 } = require('uuid');
const {RunEventBuilder} = require("../src/events/RunEvent");
const {JobFacetsBuilder, JobType} = require("../src/facets/JobFacets");

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const kafka1 = new InputDatasetBuilder("kafka1", "streams").build();
	const kafka2= new InputDatasetBuilder("kafka2", "streams").build();
	const dynamo = new OutputDatasetBuilder("dynamo", "dynamodb").build();
	const elastic = new OutputDatasetBuilder("elastic", "elasticsearch").build();
	const jobFacets = new JobFacetsBuilder().setJobType(new JobType("http://producer.com", "http://schema.com", 'STREAMING', 'integration', 'job')).build();
	const firstJob = new JobBuilder().setName("firstJob").setNamespace("primarySaving").addFacets(jobFacets).build();
	const secondJob = new JobBuilder().setName("secondJob").setNamespace("replication").addFacets(jobFacets).build();
	const run = new RunBuilder().setRunId(uuidv4()).build();
	const secondRun = new RunBuilder().setRunId(uuidv4()).build();
	const firstEvent = new RunEventBuilder(new Date().toISOString(), "https://example.com", "https://example.com/schema", EventType.START)
	.setRun(run).setJob(firstJob).setInputs([kafka1, kafka2]).setOutputs([dynamo]).build();
	const secondEvent = new RunEventBuilder(new Date().toISOString(), "https://example.com", "https://example.com/schema", EventType.START)
	.setRun(secondRun).setJob(secondJob).setInputs([dynamo]).setOutputs([elastic]).build();
	const url = "http://localhost:8080/api/v1/lineage";
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com", transport);
	await client.emit(firstEvent);
	await client.emit(secondEvent);
  });
});
