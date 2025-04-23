import { Run } from '../entities/Run.js';
import { Job } from '../entities/Job.js';
import { RunEvent } from '../events/RunEvent.js';
import { InputDataset } from '../entities/InputDataset.js';
import { OutputDataset } from '../entities/OutputDataset.js';
import { EventType } from '../types/EventTypes.js';
import { validateEvent } from '../utils/utils.js';

/**
 * Builder for creating RunEvent instances.
 * Provides a fluent interface to set properties of a RunEvent.
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

  /**
   * Constructs a new RunEventBuilder.
   *
   * @param eventTime - The ISO 8601 timestamp of the event.
   * @param producer - The URI identifying the producer of the event.
   * @param schemaURL - The URL pointing to the OpenLineage schema version.
   * @param eventType - The type of the run event (START, COMPLETE, FAIL, etc.).
   */
  constructor(
    eventTime: string,
    producer: string,
    schemaURL: string,
    eventType: EventType,
  ) {
    this.eventTime = eventTime;
    this.producer = producer;
    this.schemaURL = schemaURL;
    this.eventType = eventType;
  }

  /**
   * Sets the run details for the event.
   * @param run - The Run entity.
   * @returns The builder instance for method chaining.
   */
  setRun(run: Run): this {
    this.run = run;
    return this;
  }

  /**
   * Sets the job details for the event.
   * @param job - The Job entity.
   * @returns The builder instance for method chaining.
   */
  setJob(job: Job): this {
    this.job = job;
    return this;
  }

  /**
   * Sets the input datasets for the event.
   * Note: Type currently allows both InputDataset and OutputDataset arrays.
   * @param inputs - An array of input datasets.
   * @returns The builder instance for method chaining.
   */
  setInputs(inputs: InputDataset[] | OutputDataset[]): this {
    this.inputs = inputs;
    return this;
  }

  /**
   * Sets the output datasets for the event.
   * Note: Type currently allows both InputDataset and OutputDataset arrays.
   * @param outputs - An array of output datasets.
   * @returns The builder instance for method chaining.
   */
  setOutputs(outputs: InputDataset[] | OutputDataset[]): this {
    this.outputs = outputs;
    return this;
  }

  /**
   * Builds the RunEvent instance.
   * Validates the constructed event against the schema.
   *
   * @returns The constructed and validated RunEvent.
   * @throws {Error} If required fields (run, job, inputs, outputs) are missing.
   * @throws {Error} If the constructed event fails schema validation.
   */
  build(): RunEvent {
    if (!this.run || !this.job || !this.inputs || !this.outputs) {
      throw new Error('RunEventBuilder: Required fields are missing');
    }
    const event = new RunEvent(
      this.eventTime,
      this.producer,
      this.schemaURL,
      this.eventType,
      this.run,
      this.job,
      this.inputs,
      this.outputs,
    );
    if (validateEvent(event)) {
      return event;
    }
    throw new Error('RunEvent validation failed');
  }
}
