import { Dataset } from '../entities/Dataset';
import { DatasetEvent } from '../events/DatasetEvent';
import { validateEvent } from '../utils/utils';

/**
 * Builder for creating DatasetEvent instances.
 */
export class DatasetEventBuilder {
	private eventTime: string;
	private producer: string;
	private schemaURL: string;
	private dataset?: Dataset;

	constructor(eventTime: string, producer: string, schemaURL: string) {
		this.eventTime = eventTime;
		this.producer = producer;
		this.schemaURL = schemaURL;
	}

	setDataset(dataset: Dataset): this {
		this.dataset = dataset;
		return this;
	}

	build(): DatasetEvent {
		if (!this.dataset) {
			throw new Error('DatasetEvent requires "dataset" to be set');
		}
		const event = new DatasetEvent(this.eventTime, this.producer, this.schemaURL, this.dataset);
		if (validateEvent(event)) {
			return event;
		}
		throw new Error("JobEvent validation failed");
	}
}