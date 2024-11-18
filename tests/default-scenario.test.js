import {generateDummyJobEvent} from "./dummy-event";
import {ConsoleTransport} from '../src/index.js';
import {OpenLineageClient} from '../src/client';
import { jest } from '@jest/globals';

describe('DefaultScenario', () => {
  it('Creates client sets up a transport and transports an event', async () => {

	const producer = 'https://example.com/producer';

	const event = generateDummyJobEvent("Default Scenario", "Tests");
	const client = new OpenLineageClient(producer, new ConsoleTransport());

	const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
	});

	await client.emit(event);

	expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

	consoleSpy.mockRestore();
  });
});