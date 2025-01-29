import { Dataset } from "../entities/Dataset.js";
import { validateEvent, removeEmptyFields } from "../utils/utils.js";
import { BaseEvent } from "./BaseEvent.js";

/**
 * Represents a DatasetEvent.
 */
export class DatasetEvent extends BaseEvent {
	dataset: Dataset;

	constructor(eventTime: string, producer: string, schemaURL: string, dataset: Dataset) {
		super(eventTime, producer, schemaURL);
		this.dataset = dataset;
		Object.assign(this, removeEmptyFields(this));
	}
}