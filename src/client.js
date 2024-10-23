import {BaseEvent} from './events/BaseEvent';
import {ConsoleTransport} from './transport/console';
import {Transport} from './transport/Transport';

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

export {OpenLineageClient};
