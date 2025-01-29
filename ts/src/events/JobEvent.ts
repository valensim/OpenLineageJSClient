import { InputDataset } from "../entities/InputDataset.js";
import { Job } from "../entities/Job.js";
import { OutputDataset } from "../entities/OutputDataset.js";
import { BaseEvent } from "./BaseEvent.js";
import {removeEmptyFields } from "../utils/utils.js";

/**
 * Represents a JobEvent.
 */
export class JobEvent extends BaseEvent {
	job: Job;
	inputs: InputDataset[] | OutputDataset[];
	outputs: InputDataset[] | OutputDataset[];

	constructor(
		eventTime: string,
		producer: string,
		schemaURL: string,
		job: Job,
		inputs: InputDataset[] | OutputDataset[],
		outputs: InputDataset[] | OutputDataset[]
	) {
		super(eventTime, producer, schemaURL);
		this.job = job;
		this.inputs = inputs;
		this.outputs = outputs;
		Object.assign(this, removeEmptyFields(this));
	}
}