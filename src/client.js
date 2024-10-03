// src/client.js
const BaseEvent = require("./events/BaseEvent");
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
  emit(event) {
	if (!this.transport) {
	  throw new Error("Transport is not set");
	}
	this.transport.emit(event);
  }
}

module.exports = {OpenLineageClient};
