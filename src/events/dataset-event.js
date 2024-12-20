import {Dataset} from "../dataset.js";
import {validateEvent, removeEmptyFields} from "../utils/utils.js";
import {BaseEvent} from "./base-event.js";

/**
 * @class
 */
class DatasetEvent extends BaseEvent {
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {Dataset} dataset
   */
  constructor(eventTime, producer, schemaURL, dataset) {
	super(eventTime, producer, schemaURL);
	this.dataset = dataset;
	Object.assign(this, removeEmptyFields(this));
  }
}

class DatasetEventBuilder {
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   */
  constructor(eventTime, producer, schemaURL) {
	this.eventTime = eventTime;
	this.producer = producer;
	this.schemaURL = schemaURL;
  }

  /**
   * @param {Dataset} dataset
   * @returns {DatasetEventBuilder}
   */
  setDataset(dataset) {
	this.dataset = dataset;
	return this;
  }

  /**
   * @returns {DatasetEvent}
   */
  build() {
	if (!this.dataset) {
	  throw new Error('DatasetEvent requires "dataset" to be set');
	}
	let event = new DatasetEvent(this.eventTime, this.producer, this.schemaURL,
		this.dataset);
	validateEvent(event);
	return event;
  }
}

export {DatasetEvent, DatasetEventBuilder};