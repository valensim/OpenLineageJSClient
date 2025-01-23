import { OpenLineageClient ,ConsoleTransport } from '../src';
import { describe, it, expect, vi } from "vitest"; // Add vi to imports
import { DummyEvent } from './test-utils/DummyEvent';

describe('DefaultScenario', () => {
  it('Creates client sets up a transport and transports an event', async () => {

	const dummy = new DummyEvent('https://example.com/producer', 'https://example.com/schema');
	const event = dummy.generateDummyJobEvent("Default Scenario", "Tests");
	const client = new OpenLineageClient(new ConsoleTransport());

	const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
	});

	await client.emit(event);

	expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

	consoleSpy.mockRestore();
  });
});