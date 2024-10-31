import {OpenLineageClient} from "../src/client";
import {HttpTransport} from "../src/transport/http";

describe('ConfigFile', () => {
  it('should initialize client from config file if one is present', async () => {
	const client = new OpenLineageClient("http://localhost:8080");
	expect(client.transport).toBeInstanceOf(HttpTransport);
  });
});