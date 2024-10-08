const { InputDataset } = require("../InputDataset");
const Job = require("../Job");
const { OutputDataset } = require("../OutputDataset");
const BaseEvent = require("./BaseEvent");
const {validateEvent, removeEmptyFields} = require("../utils/Utils");

/**
 * @class
 */
class JobEvent extends BaseEvent{
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {Job} job
   * @param {InputDataset[]} inputs
   * @param {OutputDataset[]} outputs
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
   * @param {InputDataset[]} inputs
   * @returns {JobEventBuilder}
   */
  setInputs(inputs) {
	this.inputs = inputs;
	return this;
  }

  /**
   * @param {OutputDataset[]} outputs
   * @returns {JobEventBuilder}
   */
  setOutputs(outputs) {
	this.outputs = outputs;
	return this;
  }

  build() {
	if (!this.job || !this.inputs || !this.outputs) {
	  throw new Error('Job, "inputs" and "outputs" are required fields for JobEvent');
	}
	let event = new JobEvent(this.eventTime, this.producer, this.schemaURL, this.job, this.inputs, this.outputs);
	let validation = validateEvent(event);
	if (validation) {
	  return event;
	}
  }
}
module.exports = {JobEvent, JobEventBuilder};