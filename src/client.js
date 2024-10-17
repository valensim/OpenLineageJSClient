// src/client.js
const BaseEvent = require("./events/BaseEvent");
const { ConsoleTransport } = require("./transport/console");
const { Transport } = require("./transport/Transport");

/**
 * @class
 */
class OpenLineageClient {
  /**
   * @param {string | null} url
   * @param {Transport | null} transport
   */
  constructor(url, transport) {
	this.url = url;
	this.transport = transport;
	return this;
  }

  /**
   * @param {BaseEvent} event
   */
  async emit(event) {
	if (!this.transport) {
	  this.transport = new ConsoleTransport();
	  console.log("No transport provided, defaulting to console transport");
	}
	await this.transport.emit(event);
  }
}

module.exports = {OpenLineageClient};
