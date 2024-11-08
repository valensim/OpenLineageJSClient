import {BaseEvent} from './events/base-event';
import {ConsoleTransport} from './transport/console';
import {Transport} from './transport/transport';
import {getTransportFromFile} from "./transport/factory";

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
   */
  async emit(event) {
	if (!this.transport) {
	  this.transport = new ConsoleTransport();
	  console.log("No transport provided, defaulting to console transport");
	}
	await this.transport.emit(event);
  }
}

export {OpenLineageClient};
