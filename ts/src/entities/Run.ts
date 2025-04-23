import { RunFacets } from '../facets/RunFacets.js';

/**
 * Represents a run - a specific execution instance of a job.
 */
export class Run {
  /** A unique identifier for this run instance (UUID recommended). */
  runId: string;
  /** Optional collection of facets providing additional metadata about the run. */
  facets: RunFacets | Record<string, unknown>;

  /**
   * Constructs a new Run instance.
   *
   * @param runId - The unique identifier for this run.
   * @param facets - Optional collection of run facets (default: {}).
   */
  constructor(runId: string, facets: RunFacets | Record<string, unknown> = {}) {
    this.runId = runId;
    this.facets = facets;
  }
}
