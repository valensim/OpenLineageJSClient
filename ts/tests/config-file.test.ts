import {OpenLineageClient, ConsoleTransport, HttpTransport} from "../src";
import fs from "fs";
import path from "path";
import {describe, it, expect} from "vitest";

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
	let client = new OpenLineageClient();
	expect(client.transport).toBeInstanceOf(ConsoleTransport);

	fs.writeFileSync(filePath, httpConfig);
	client = new OpenLineageClient();
	expect(client.transport).toBeInstanceOf(HttpTransport);

	if (contents !== '') {
	  fs.writeFileSync(filePath, contents);
	} else {
	  fs.unlinkSync(filePath);
	}
  });
});