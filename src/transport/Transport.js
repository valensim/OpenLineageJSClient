import {BaseEvent} from "../events/BaseEvent";

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

class Config {
  constructor() {}
}

export { Transport, Config };