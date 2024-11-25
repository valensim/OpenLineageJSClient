import {BaseEvent} from './events/base-event.js';
import {ConsoleTransport} from './transport/console.js';
import {Transport} from './transport/transport.js';
import {getTransportFromFile} from './transport/factory.js';

/**
 * @class
 */
class OpenLineageClient {
  /**
   * @param {string | null} url
   * @param {Transport | null} transport
   */
  constructor(url, transport = null) {
	this.url = url;
	this.transport = transport;
	if (!this.transport) {
	  this.transport = getTransportFromFile();
	}
  }

  /**
   * @param {BaseEvent} event
   * @returns {Promise<void>}
   */
  async emit(event) {
	if (!this.transport) {
	  this.transport = new ConsoleTransport();
	  console.log("No transport provided, defaulting to console transport");
	}
	return await this.transport.emit(event);
  }
}

export {OpenLineageClient};
