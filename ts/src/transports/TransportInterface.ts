import { BaseEvent } from '../events/BaseEvent.js';

/**
 * Interface for OpenLineage event transports.
 * Defines the contract for sending events to different destinations.
 */
export interface Transport {
  /**
   * Emits an OpenLineage event asynchronously.
   *
   * @template T - The expected type of the response after emitting the event (transport-specific).
   * @param event - The OpenLineage event object to emit.
   * @returns A promise that resolves with the transport-specific response (e.g., AxiosResponse for HTTP, void for Console).
   * @throws {Error} If emitting the event fails.
   */
  emit<T>(event: BaseEvent): Promise<T>;
}
