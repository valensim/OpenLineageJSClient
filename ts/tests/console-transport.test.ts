import { ConsoleTransport, EventType } from '../src';
import { DummyEvent } from './test-utils/DummyEvent';
import { describe, it, expect, vi } from 'vitest';

describe('ConsoleTransport', () => {
  it('should emit an event to the console', async () => {

    const producer = 'https://example.com/producer';
    const schemaURL = 'https://example.com/schema';
    const dummy = new DummyEvent(producer, schemaURL);
    const event = dummy.generateDummyRunEvent(EventType.RUNNING, dummy.generateNewJob('JobName', 'JobNamespace'));
    const consoleTransport = new ConsoleTransport();

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
    });

    await consoleTransport.emit(event);

    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

    consoleSpy.mockRestore();
  });
});