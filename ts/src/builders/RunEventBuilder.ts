import { Run } from '../entities/Run.js';
import { Job } from '../entities/Job.js';
import { RunEvent } from '../events/RunEvent.js';
import { InputDataset } from '../entities/InputDataset.js';
import { OutputDataset } from '../entities/OutputDataset.js';
import { EventType } from '../types/EventTypes.js';
import { validateEvent } from '../utils/utils.js';

/**
 * Builder for creating RunEvent instances.
 */
export class RunEventBuilder {
	private eventTime: string;
	private producer: string;
	private schemaURL: string;
	private eventType: EventType;
	private run?: Run;
	private job?: Job;
	private inputs?: InputDataset[] | OutputDataset[];
	private outputs?: InputDataset[] | OutputDataset[];

	constructor(eventTime: string, producer: string, schemaURL: string, eventType: EventType) {
		this.eventTime = eventTime;
		this.producer = producer;
		this.schemaURL = schemaURL;
		this.eventType = eventType;
	}

	setRun(run: Run): this {
		this.run = run;
		return this;
	}

	setJob(job: Job): this {
		this.job = job;
		return this;
	}

	setInputs(inputs: InputDataset[] | OutputDataset[]): this {
		this.inputs = inputs;
		return this;
	}

	setOutputs(outputs: InputDataset[] | OutputDataset[]): this {
		this.outputs = outputs;
		return this;
	}

	build(): RunEvent {
		if (!this.run || !this.job || !this.inputs || !this.outputs) {
			throw new Error("RunEventBuilder: Required fields are missing");
		}
		const event = new RunEvent(
			this.eventTime,
			this.producer,
			this.schemaURL,
			this.eventType,
			this.run,
			this.job,
			this.inputs,
			this.outputs
		);
		if (validateEvent(event)) {
			return event;
		}
		throw new Error("RunEvent validation failed");
	}
}