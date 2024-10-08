const BaseEvent = require("../events/BaseEvent");
const {Transport} = require("./Transport");

class ConsoleTransport extends Transport {
  constructor() {
	super();
  }

  /**
   * @param {BaseEvent} event
   */
  emit(event) {
	console.log(JSON.stringify(event, null, 2));
  }
}

module.exports = {ConsoleTransport};