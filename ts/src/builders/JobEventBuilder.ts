import { Job } from '../entities/Job';
import { JobEvent } from '../events/JobEvent';
import { InputDataset } from '../entities/InputDataset';
import { OutputDataset } from '../entities/OutputDataset';
import { validateEvent } from '../utils/utils';

/**
 * Builder for creating JobEvent instances.
 */
export class JobEventBuilder {
	private eventTime: string;
	private producer: string;
	private schemaURL: string;
	private job?: Job;
	private inputs?: InputDataset[] | OutputDataset[];
	private outputs?: InputDataset[] | OutputDataset[];

	constructor(eventTime: string, producer: string, schemaURL: string) {
		this.eventTime = eventTime;
		this.producer = producer;
		this.schemaURL = schemaURL;
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

	build(): JobEvent {
		if (!this.job || !this.inputs || !this.outputs) {
			throw new Error('Job, "inputs" and "outputs" are required fields for JobEvent');
		}
		const event = new JobEvent(
			this.eventTime,
			this.producer,
			this.schemaURL,
			this.job,
			this.inputs,
			this.outputs
		);
		if (validateEvent(event)) {
			return event;
		}
		throw new Error("JobEvent validation failed");
	}
}