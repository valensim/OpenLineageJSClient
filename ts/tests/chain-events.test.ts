import {
  InputDatasetBuilder,
  OutputDatasetBuilder,
  JobFacetsBuilder,
  JobType,
  ProcessingType,
  JobBuilder,
  RunBuilder,
  RunEventBuilder,
  EventType,
  HttpTransport,
  HttpConfig,
  OpenLineageClient,
} from '../src';
import { v4 as uuidv4 } from 'uuid';
import nock from 'nock';
import dotenv from 'dotenv';
import { describe, it, expect } from 'vitest';
import { AxiosResponse } from 'axios';

describe('chain-event', () => {
  it('should create more complicated pipeline in Marquez', async () => {
    const kafka1 = new InputDatasetBuilder().setName('kafka1').setNamespace('streams').build();
    const kafka2 = new InputDatasetBuilder().setName('kafka2').setNamespace('streams').build();
    const dynamo = new OutputDatasetBuilder().setName("dynamo").setNamespace('aws').build();
    const elastic = new OutputDatasetBuilder().setName('elastic').setNamespace('elasticsearch').build();
    const jobFacets = new JobFacetsBuilder().setJobType(
      new JobType('kafka://producer.com', 'yoMama://schema.com', ProcessingType.STREAMING,
        'integration', 'job')).build();
    const firstJob = new JobBuilder().setName('firstJob').setNamespace(
      'primarySaving').addFacets(jobFacets).build();
    const secondJob = new JobBuilder().setName('secondJob').setNamespace(
      'replication').addFacets(jobFacets).build();
    const run = new RunBuilder().setRunId(uuidv4()).build();
    const secondRun = new RunBuilder().setRunId(uuidv4()).build();
    const firstEvent = new RunEventBuilder(new Date().toISOString(),
      'https://example.com', 'https://example.com/schema', EventType.START)
    .setRun(run).setJob(firstJob).setInputs([kafka1, kafka2]).setOutputs(
      [dynamo]).build();
    const secondEvent = new RunEventBuilder(new Date().toISOString(),
      'https://example.com', 'https://example.com/schema', EventType.START)
    .setRun(secondRun).setJob(secondJob).setInputs([dynamo]).setOutputs(
      [elastic]).build();
    const url = 'http://localhost:8080/api/v1/lineage';
    const transport = new HttpTransport(new HttpConfig(url));
    const client = new OpenLineageClient(transport);

    if (process.env.MARQUEZ_UP === 'true') {
      let response = await client.emit(firstEvent) as AxiosResponse<any, any>;
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
