import {HttpTransport, HttpConfig} from "../src/index.js";
import {EventType} from "../src/types";
import {OpenLineageClient} from "../src/client";
import {InputDatasetBuilder} from "../src/index.js";
import {OutputDatasetBuilder} from "../src/index.js";
import {JobBuilder} from "../src/job";
import {RunBuilder} from "../src/run";
import {v4 as uuidv4} from 'uuid';
import {RunEventBuilder} from "../src/index.js";
import {JobFacetsBuilder, JobType} from "../src/index.js";
import nock from "nock";
import dotenv from 'dotenv';
import {describe, it, expect} from "vitest";
dotenv.config();

describe('chain-event', () => {
  it('should create more complicated pipeline in Marquez', async () => {
	const kafka1 = new InputDatasetBuilder("kafka1", "streams").build();
	const kafka2 = new InputDatasetBuilder("kafka2", "streams").build();
	const dynamo = new OutputDatasetBuilder("dynamo", "dynamodb").build();
	const elastic = new OutputDatasetBuilder("elastic",
		"elasticsearch").build();
	const jobFacets = new JobFacetsBuilder().setJobType(
		new JobType("kafka://producer.com", "yoMama://schema.com", 'STREAMING',
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

	if (process.env.MARQUEZ_UP === 'true') {
	  let response = await client.emit(firstEvent);
	  expect(response.status).toBe(201);
	  expect(response.statusText).toBe('Created');

	  response = await client.emit(secondEvent);
	  expect(response.status).toBe(201);
	  expect(response.statusText).toBe('Created');
	} else {
	  const scope = nock('http://localhost:8080')
	  .post('/api/v1/lineage')
	  .times(2)
	  .reply(201, { status: 'ok' });
	  await client.emit(firstEvent);
	  await client.emit(firstEvent);
	  scope.done();
	}

  });
});
