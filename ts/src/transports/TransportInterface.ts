import { BaseEvent } from '../events/BaseEvent.js';

export interface Transport {
  emit<T>(event: BaseEvent): Promise<T>; // Emit an event asynchronously
}
