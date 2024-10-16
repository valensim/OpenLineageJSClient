const { getDummyRunEvent } = require("./DummyEvent");
const { OpenLineageClient } = require("../src/client");
const { HttpTransport, HttpConfig } = require("../src/transport/http");
const axios = require('axios');

describe('HttpTransport', () => {
  it('should shoot a run event at Marquez', async () => {
	const url = "http://localhost:8080/api/v1/lineage";
	const runEvent = getDummyRunEvent();
	const transport = new HttpTransport(new HttpConfig(url));
	const client = new OpenLineageClient("https://example.com/producer", transport);
	try{
	  const result = await axios(transport.getConfig(runEvent));
	  console.log(result.data);
	} catch (error) {
	  console.log(error);
	}
  });
});