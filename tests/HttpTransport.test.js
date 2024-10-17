const { getDummyRunEvent, generateNewJob} = require("./DummyEvent");
const { HttpTransport, HttpConfig } = require("../src/transport/http");
const axios = require('axios');
const {EventType} = require("../src/types");
const {OpenLineageClient} = require("../src/client");

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const url = "http://localhost:8080/api/v1/lineage";
	const job = generateNewJob('httpTransport', 'clientTests');
	const runEvent = getDummyRunEvent(EventType.COMPLETE, job);
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com", transport);
	await client.emit(runEvent);
	// try{
	//   const result = await axios(transport.getConfig(runEvent));
	//   console.log(result.data);
	// } catch (error) {
	//   console.log(error);
	// }
  });
});