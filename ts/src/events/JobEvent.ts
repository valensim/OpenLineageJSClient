import { InputDataset } from "../entities/InputDataset";
import { Job } from "../entities/Job";
import { OutputDataset } from "../entities/OutputDataset";
import { BaseEvent } from "./BaseEvent";
import {removeEmptyFields } from "../utils/utils";

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