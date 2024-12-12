import {isValidURI} from "../utils/utils.js";

/**
 * @class
 */
class BaseEvent {
  /**
   *
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   */
  constructor(eventTime, producer, schemaURL) {
	if (!isValidURI(schemaURL) || !isValidURI(producer)) {
	  throw new Error('Invalid URL');
	}
	this.eventTime = eventTime;
	this.producer = producer;
	this.schemaURL = schemaURL;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/2-0-2/OpenLineage.json"
  }
}

export {BaseEvent};