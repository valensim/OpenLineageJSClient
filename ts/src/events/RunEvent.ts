import { InputDataset } from '../entities/InputDataset.js';
import { Job } from '../entities/Job.js';
import { OutputDataset } from '../entities/OutputDataset.js';
import { Run } from '../entities/Run.js';
import { EventType } from '../types/EventTypes.js';
import { BaseEvent } from './BaseEvent.js';
import { removeEmptyFields } from '../utils/utils.js';

/**
 * Represents a specific event occurring during the lifecycle of a job run (e.g., START, COMPLETE, FAIL).
 * This is the primary event type emitted by producers.
 */
export class RunEvent extends BaseEvent {
  /** The type of the event (e.g., START, COMPLETE). */
  eventType: EventType;
  /** Details about the specific execution run. */
  run: Run;
  /** Details about the job being run. */
  job: Job;
  /** List of input datasets consumed by the run. */
  inputs?: InputDataset[] | OutputDataset[]; // Type needs review - should likely be InputDataset[]
  /** List of output datasets produced by the run. */
  outputs?: InputDataset[] | OutputDataset[]; // Type needs review - should likely be OutputDataset[]

  /**
   * Constructs a new RunEvent.
   *
   * @param eventTime - The ISO 8601 timestamp when the event occurred.
   * @param producer - The URI identifying the producer (source) of this event.
   * @param schemaURL - The URL of the OpenLineage schema definition for this event.
   * @param eventType - The specific type of run event (START, COMPLETE, FAIL, etc.).
   * @param run - The Run entity associated with this event.
   * @param job - The Job entity associated with this event.
   * @param inputs - An array of input datasets (optional).
   * @param outputs - An array of output datasets (optional).
   */
  constructor(
    eventTime: string,
    producer: string,
    schemaURL: string,
    eventType: EventType,
    run: Run,
    job: Job,
    inputs: InputDataset[] | OutputDataset[],
    outputs: InputDataset[] | OutputDataset[],
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
