import {generateDummyJobEvent} from "./DummyEvent";
import {ConsoleTransport} from '../src/transport/console';
import {OpenLineageClient} from '../src/client';
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