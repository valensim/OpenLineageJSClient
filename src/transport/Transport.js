const BaseEvent = require("../events/BaseEvent");

/**
 * @class Transport
 */
class Transport {
  constructor() {
  }

  /**
   * @param {BaseEvent} event
   */
  emit(event) {
	throw new Error("Transport.emit must be overridden");
  }
}

module.exports = {Transport};