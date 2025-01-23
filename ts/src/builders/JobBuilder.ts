import { Job } from "../entities/Job";
import { JobFacets } from "../facets/JobFacets";

/**
 * Builder for creating Job instances.
 */
export class JobBuilder {
  private namespace: string | null = null;
  private name: string | null = null;
  private facets: JobFacets | Record<string, unknown> = {};

  setNamespace(namespace: string): this {
    this.namespace = namespace;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  addFacets(facets: JobFacets): this {
    this.facets = facets;
    return this;
  }

  build(): Job {
    if (!this.namespace || !this.name) {
      throw new Error("Namespace and Job Name are required");
    }
    return new Job(this.namespace, this.name, this.facets);
  }
}