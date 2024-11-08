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

// // TODO: should this even exist? I don't believe that it needs to given there are no needed methods
// class TransportConfig {
//   constructor() {}
// }

export { Transport};