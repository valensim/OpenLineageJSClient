import {HttpTransport, HttpConfig} from "../src/transport/http";
import {EventType} from "../src/types";
import {OpenLineageClient} from "../src/client";
import {InputDatasetBuilder} from "../src/input-dataset";
import {OutputDatasetBuilder} from "../src/output-dataset";
import {JobBuilder} from "../src/job";
import {RunBuilder} from "../src/run";
import {v4 as uuidv4} from 'uuid';
import {RunEventBuilder} from "../src/events/run-event";
import {JobFacetsBuilder, JobType} from "../src/facets/job-facets";

describe.skip('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const kafka1 = new InputDatasetBuilder("kafka1", "streams").build();
	const kafka2 = new InputDatasetBuilder("kafka2", "streams").build();
	const dynamo = new OutputDatasetBuilder("dynamo", "dynamodb").build();
	const elastic = new OutputDatasetBuilder("elastic",
		"elasticsearch").build();
	const jobFacets = new JobFacetsBuilder().setJobType(
		new JobType("http://producer.com", "http://schema.com", 'STREAMING',
			'integration', 'job')).build();
	const firstJob = new JobBuilder().setName("firstJob").setNamespace(
		"primarySaving").addFacets(jobFacets).build();
	const secondJob = new JobBuilder().setName("secondJob").setNamespace(
		"replication").addFacets(jobFacets).build();
	const run = new RunBuilder().setRunId(uuidv4()).build();
	const secondRun = new RunBuilder().setRunId(uuidv4()).build();
	const firstEvent = new RunEventBuilder(new Date().toISOString(),
		"https://example.com", "https://example.com/schema", EventType.START)
	.setRun(run).setJob(firstJob).setInputs([kafka1, kafka2]).setOutputs(
		[dynamo]).build();
	const secondEvent = new RunEventBuilder(new Date().toISOString(),
		"https://example.com", "https://example.com/schema", EventType.START)
	.setRun(secondRun).setJob(secondJob).setInputs([dynamo]).setOutputs(
		[elastic]).build();
	const url = "http://localhost:8080/api/v1/lineage";
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com", transport);
	await client.emit(firstEvent);
	await client.emit(secondEvent);
  });
});
