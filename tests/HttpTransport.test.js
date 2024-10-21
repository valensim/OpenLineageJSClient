const { getDummyRunEvent, generateNewJob} = require("./DummyEvent");
const { HttpTransport, HttpConfig } = require("../src/transport/http");
const axios = require('axios');
const {EventType} = require("../src/types");
const {OpenLineageClient} = require("../src/client");
const nock = require('nock');

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const url = "http://localhost:8080/api/v1/lineage";
	const job = generateNewJob('httpTransport', 'clientTests');
	const runEvent = getDummyRunEvent(EventType.COMPLETE, job);
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com", transport);
	 const scope = nock('http://localhost:8080')
	   .post('/api/v1/lineage')
	   .reply(201, {status: 'ok'});
	await client.emit(runEvent);
	scope.done();
  });
});