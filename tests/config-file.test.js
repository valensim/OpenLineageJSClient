import {OpenLineageClient} from "../src/client";
import {HttpTransport} from "../src/transport/http";
import fs from "fs";
import path from "path";
import {ConsoleTransport} from "../src/transport/console";

describe('ConfigFile', () => {
  it('should initialize client from config file if one is present', async () => {

	const consoleConfig = 'transport:\n  type: console';
	const httpConfig = 'transport:\n  type: http\n  url: http://localhost:8080/api/v1/lineage';
	const filePath = path.join(__dirname, '../openlineage.yaml');
	let contents = ''

	if (fs.existsSync(filePath)) {
	  contents = fs.readFileSync(filePath, 'utf8');
	}

	fs.writeFileSync(filePath, consoleConfig);
	let client = new OpenLineageClient("http://test.com");
	expect(client.transport).toBeInstanceOf(ConsoleTransport);

	fs.writeFileSync(filePath, httpConfig);
	client = new OpenLineageClient("http://test.com");
	expect(client.transport).toBeInstanceOf(HttpTransport);

	if (contents !== '') {
	  fs.writeFileSync(filePath, contents);
	} else {
	  fs.unlinkSync(filePath);
	}
  });
});