import { BaseEvent } from './events/BaseEvent.js';
import { ConsoleTransport } from './transports/ConsoleTransport.js';
import { Transport } from './transports/TransportInterface.js';
import { getTransportFromFile } from './transports/Factory.js';

/**
 * OpenLineageClient is responsible for emitting events to a specified transport.
 */
export class OpenLineageClient {
  /**
   * The transport instance used for emitting events.
   * Can be null initially if loading from file fails before defaulting to ConsoleTransport.
   */
  public transport: Transport | null;

  /**
   * Constructs an OpenLineageClient instance.
   * If no transport is provided, it attempts to load configuration from
   * the `openlineage.yaml` file using `getTransportFromFile()`.
   * If loading from file fails or no transport is provided, it defaults to `ConsoleTransport`.
   *
   * @param transport - A custom transport implementation (optional).
   */
  constructor(transport: Transport | null = null) {
    this.transport = transport || getTransportFromFile();

    if (!this.transport) {
      this.transport = new ConsoleTransport();
      console.log('No transport provided, defaulting to console transport');
    }
  }

  /**
   * Emits an event using the configured transport.
   * @param event - The event to emit.
   * @returns A promise that resolves when the event is successfully emitted.
   */
  async emit<T>(event: BaseEvent): Promise<T> {
    if (!this.transport) {
      this.transport = new ConsoleTransport();
      console.log('No transport provided, defaulting to console transport');
    }
    return this.transport.emit(event);
  }
}
