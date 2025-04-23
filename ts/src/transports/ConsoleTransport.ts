import { Transport } from './TransportInterface.js';
import { BaseEvent } from '../events/BaseEvent.js';

/**
 * A simple transport that logs events to the console.
 * Useful for debugging and development purposes.
 */
export class ConsoleTransport implements Transport {
  /**
   * Logs the event to the console as a JSON string.
   *
   * @template T - Expected to be void for this transport.
   * @param event - The event to log.
   * @returns A promise that resolves immediately with void.
   */
  async emit<T = void>(event: BaseEvent): Promise<T> {
    console.log(JSON.stringify(event, null, 2));
    return Promise.resolve() as Promise<T>;
  }
}
