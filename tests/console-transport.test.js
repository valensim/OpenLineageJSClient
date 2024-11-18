import {ConsoleTransport} from '../src/index.js';
import {generateDummyJobEvent} from "./dummy-event";
import { jest } from '@jest/globals';

describe('ConsoleTransport', () => {
  it('should emit an event to the console', async () => {

	const event = generateDummyJobEvent("Event Creation", "Tests");
	const consoleTransport = new ConsoleTransport();

	const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
	});

	await consoleTransport.emit(event);

	expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

	consoleSpy.mockRestore();
  });
});