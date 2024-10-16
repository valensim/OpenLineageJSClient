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
  async emit(event) {
	throw new Error("Transport.emit must be overridden");
  }

}

/**
 * @class Config
 */
class Config {
    constructor() {
    }

  fromFile() {
        throw new Error("Config.fromFile must be overridden");
    }
}

module.exports = {Transport, Config};