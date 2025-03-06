import {InputDataset} from '../input-dataset.js';
import {Job} from '../job.js';
import {OutputDataset} from '../output-dataset.js';
import {Run} from '../run.js';
import {EventType} from '../types.js';
import {BaseEvent} from './base-event.js';
import {validateEvent, removeEmptyFields} from "../utils/utils.js";

/**
 * @class
 */
class RunEvent extends BaseEvent {
  /**
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   * @param {EventType} eventType
   * @param {Run} run
   * @param {Job} job
   * @param {InputDataset[] | OutputDataset[]} inputs
   * @param {InputDataset[] | OutputDataset[]} outputs
   */
  constructor(eventTime, producer, schemaURL, eventType, run, job, inputs,
	  outputs) {
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
   * @param {InputDataset[] | OutputDataset[]} inputs
   * @returns {RunEventBuilder}
   */
  setInputs(inputs) {
	this.inputs = inputs;
	return this;
  }

  /**
   * @param {InputDataset[] | OutputDataset[]} outputs
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
	if (this.run === undefined || this.job === undefined || this.inputs
		=== undefined || this.outputs === undefined) {
	  throw new Error("RunEventBuilder: Required fields are missing");
	}
	let event = new RunEvent(this.eventTime, this.producer, this.schemaURL,
		this.eventType, this.run, this.job, this.inputs, this.outputs);
	let validation = validateEvent(event);
	if (validation === true) {
	  return event;
	}
  }
}

export {RunEvent, RunEventBuilder};