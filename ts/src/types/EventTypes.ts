//export type EventType = 'START' | 'RUNNING' | 'COMPLETE' | 'ABORT' | 'FAIL' | 'OTHER';
/**
 * Defines the type of event occurring during a job run's lifecycle.
 */
export enum EventType {
  /** The job run has started. */
  START = 'START',
  /** The job run is currently in progress. Note: This event type might be deprecated or less common in newer spec versions. */
  RUNNING = 'RUNNING',
  /** The job run completed successfully. */
  COMPLETE = 'COMPLETE',
  /** The job run was aborted. */
  ABORT = 'ABORT',
  /** The job run failed. */
  FAIL = 'FAIL',
  /** An event type not covered by the standard types. Use with caution. */
  OTHER = 'OTHER',
}
