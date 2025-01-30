import { JobFacets } from '../facets/JobFacets.js';

/**
 * Represents a job.
 */
export class Job {
  namespace: string;
  name: string;
  facets: JobFacets | Record<string, unknown>;

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
