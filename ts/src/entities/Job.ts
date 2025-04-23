import { JobFacets } from '../facets/JobFacets.js';

/**
 * Represents a job - a process or task that consumes and/or produces datasets.
 */
export class Job {
  /** The namespace uniquely identifying the job's context (e.g., scheduler, orchestrator). */
  namespace: string;
  /** The unique name of the job within the namespace. */
  name: string;
  /** Optional collection of facets providing additional metadata about the job. */
  facets: JobFacets | Record<string, unknown>;

  /**
   * Constructs a new Job instance.
   *
   * @param namespace - The namespace uniquely identifying the job's context.
   * @param name - The unique name of the job within the namespace.
   * @param facets - Optional collection of job facets (default: {}).
   */
  constructor(
    namespace: string,
    name: string,
    facets: JobFacets | Record<string, unknown> = {},
  ) {
    this.namespace = namespace;
    this.name = name;
    this.facets = facets;
  }
}
