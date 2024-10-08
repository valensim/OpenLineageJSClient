const { InputDataset } = require('../InputDataset');
const Job = require('../Job');
const { OutputDataset } = require('../OutputDataset');
const Run = require('../Run');
const { EventType } = require('../types');
const BaseEvent = require('./BaseEvent')
const {validateEvent, removeEmptyFields} = require("../utils/Utils");

/**
 * @class
 */
class RunEvent extends BaseEvent{
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {EventType} eventType
   * @param {Run} run
   * @param {Job} job
   * @param {InputDataset[]} inputs
   * @param {OutputDataset[]} outputs
   */
  constructor(eventTime, producer, schemaURL, eventType, run, job, inputs, outputs) {
	super(eventTime, producer, schemaURL);
	this.eventType = eventType;
	this.run = run;
	this.job = job;
	this.inputs = inputs;
	this.outputs = outputs;
	Object.assign(this, removeEmptyFields(this));
  }
}

class RunEventBuilder {
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {EventType} eventType
   */
  constructor(eventTime, producer, schemaURL, eventType) {
	this.eventTime = eventTime;
	this.producer = producer;
	this.schemaURL = schemaURL;
	this.eventType = eventType;
  }

  /**
   * @param {Run} run
   * @returns {RunEventBuilder}
   */
  setRun(run) {
	this.run = run;
	return this;
  }

  /**
   * @param {Job} job
   * @returns {RunEventBuilder}
   */
  setJob(job) {
	this.job = job;
	return this;
  }

  /**
   * @param {InputDataset[]} inputs
   * @returns {RunEventBuilder}
   */
  setInputs(inputs) {
	this.inputs = inputs;
	return this;
  }

  /**
   * @param {OutputDataset[]} outputs
   * @returns {RunEventBuilder}
   */
  setOutputs(outputs) {
	this.outputs = outputs;
	return this;
  }

  /**
   *
   * @returns {RunEvent | undefined}
   */
  build() {
	if (this.run === undefined || this.job === undefined || this.inputs === undefined || this.outputs === undefined){
	  throw new Error("RunEventBuilder: Required fields are missing");
	}
	let event = new RunEvent(this.eventTime, this.producer, this.schemaURL, this.eventType, this.run, this.job, this.inputs, this.outputs);
	let validation = validateEvent(event);
	if(validation === true){
	  return event;
	}
  }
}
module.exports = RunEvent;
module.exports.RunEventBuilder = RunEventBuilder;