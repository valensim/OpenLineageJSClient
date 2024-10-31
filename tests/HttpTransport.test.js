import { generateDummyRunEvent, generateNewJob } from "./DummyEvent";
import { HttpTransport, HttpConfig } from "../src/transport/http";
import { EventType } from "../src/types";
import { OpenLineageClient } from "../src/client";
import nock from 'nock';

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const url = "http://localhost:8080/api/v1/lineage";
	const job = generateNewJob('httpTransport', 'clientTests');
	const runEvent = generateDummyRunEvent(EventType.COMPLETE, job);
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com", transport);
	 const scope = nock('http://localhost:8080')
	   .post('/api/v1/lineage')
	   .reply(201, {status: 'ok'});
	await client.emit(runEvent);
	scope.done();
  });
});