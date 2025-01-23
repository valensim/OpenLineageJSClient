import {InputDataset} from "../input-dataset.js";
import {Job} from "../job.js";
import {OutputDataset} from "../output-dataset.js";
import {BaseEvent} from "./base-event.js";
import {validateEvent, removeEmptyFields} from "../utils/utils.js";

/**
 * @class
 */
class JobEvent extends BaseEvent {
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {Job} job
   * @param {InputDataset[] | OutputDataset[]} inputs
   * @param {InputDataset[] | OutputDataset[]} outputs
   */
  constructor(eventTime, producer, schemaURL, job, inputs, outputs) {
	super(eventTime, producer, schemaURL);
	this.job = job;
	this.inputs = inputs;
	this.outputs = outputs;
	Object.assign(this, removeEmptyFields(this));
  }
}

class JobEventBuilder {
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
   * @param {Job} job
   * @returns {JobEventBuilder}
   */
  setJob(job) {
	this.job = job;
	return this;
  }

  /**
   * @param {InputDataset[] | OutputDataset[]} inputs
   * @returns {JobEventBuilder}
   */
  setInputs(inputs) {
	this.inputs = inputs;
	return this;
  }

  /**
   * @param {InputDataset[] | OutputDataset[]} outputs
   * @returns {JobEventBuilder}
   */
  setOutputs(outputs) {
	this.outputs = outputs;
	return this;
  }

  build() {
	if (!this.job || !this.inputs || !this.outputs) {
	  throw new Error(
		  'Job, "inputs" and "outputs" are required fields for JobEvent');
	}
	let event = new JobEvent(this.eventTime, this.producer, this.schemaURL,
		this.job, this.inputs, this.outputs);
	let validation = validateEvent(event);
	if (validation) {
	  return event;
	}
  }
}

export {JobEvent, JobEventBuilder};