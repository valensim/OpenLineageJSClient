import { Job } from '../entities/Job.js';
import { JobFacets } from '../facets/JobFacets.js';

/**
 * Builder for creating Job instances.
 */
export class JobBuilder {
  private namespace: string | null = null;
  private name: string | null = null;
  private facets: JobFacets | Record<string, unknown> = {};

  /**
   * Sets the namespace for the job.
   * @param namespace - The namespace identifier.
   * @returns The builder instance for method chaining.
   */
  setNamespace(namespace: string): this {
    this.namespace = namespace;
    return this;
  }

  /**
   * Sets the name of the job.
   * @param name - The job name.
   * @returns The builder instance for method chaining.
   */
  setName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * Sets the facets for the job.
   * @param facets - An object containing job facets.
   * @returns The builder instance for method chaining.
   */
  addFacets(facets: JobFacets): this {
    this.facets = facets;
    return this;
  }

  /**
   * Builds the Job instance.
   *
   * @returns The constructed Job.
   * @throws {Error} If required fields (namespace, name) are missing.
   */
  build(): Job {
    if (!this.namespace || !this.name) {
      throw new Error('Namespace and Job Name are required');
    }
    return new Job(this.namespace, this.name, this.facets);
  }
}
