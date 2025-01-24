import { HttpTransport, HttpConfig, OpenLineageClient, EventType } from '../src';
import { DummyEvent } from './test-utils/DummyEvent';
import nock from 'nock';
import dotenv from 'dotenv';
import { describe, it , expect} from 'vitest';
import { AxiosResponse } from 'axios';

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {

    const dummy = new DummyEvent('http://httpTransport.com', 'http://clientTests.com');
    const url = 'http://localhost:8080/api/v1/lineage';
    const job = dummy.generateNewJob('httpTransport', 'clientTests');
    const runEvent = dummy.generateDummyRunEvent(EventType.COMPLETE, job);
    const transport = new HttpTransport(new HttpConfig(url));
    const client = new OpenLineageClient(transport);

    if (process.env.MARQUEZ_UP === 'true') {
      let response = await client.emit(runEvent) as AxiosResponse<any, any>;
      console.log(response);
      expect(response.status).toBe(201);
      expect(response.statusText).toBe('Created');
    } else {
      const scope = nock('http://localhost:8080')
      .post('/api/v1/lineage')
      .reply(201, { status: 'ok' });
      await client.emit(runEvent);
      scope.done();
    }
  });
});