import {BaseEvent} from "../events/base-event.js";

/**
 * @class Transport
 */
class Transport {
  constructor() {}

  /**
   * @param {BaseEvent} event
   */
  async emit(event) {
    throw new Error("Transport.emit must be overridden");
  }
}

export { Transport};