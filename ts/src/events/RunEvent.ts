import { InputDataset } from "../entities/InputDataset.js";
import { Job } from "../entities/Job.js";
import { OutputDataset } from "../entities/OutputDataset.js";
import { Run } from "../entities/Run.js";
import { EventType } from "../types/EventTypes.js";
import { BaseEvent } from "./BaseEvent.js";
import {removeEmptyFields } from "../utils/utils.js";

/**
 * Represents a RunEvent.
 */
export class RunEvent extends BaseEvent {
	eventType: EventType;
	run: Run;
	job: Job;
	inputs: InputDataset[] | OutputDataset[];
	outputs: InputDataset[] | OutputDataset[];

	constructor(
		eventTime: string,
		producer: string,
		schemaURL: string,
		eventType: EventType,
		run: Run,
		job: Job,
		inputs: InputDataset[] | OutputDataset[],
		outputs: InputDataset[] | OutputDataset[]
	) {
		super(eventTime, producer, schemaURL);
		this.eventType = eventType;
		this.run = run;
		this.job = job;
		this.inputs = inputs;
		this.outputs = outputs;
		Object.assign(this, removeEmptyFields(this));
	}
}