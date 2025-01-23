import { InputDataset } from "../entities/InputDataset";
import { Job } from "../entities/Job";
import { OutputDataset } from "../entities/OutputDataset";
import { Run } from "../entities/Run";
import { EventType } from "../types/EventTypes";
import { BaseEvent } from "./BaseEvent";
import {removeEmptyFields } from "../utils/utils";

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