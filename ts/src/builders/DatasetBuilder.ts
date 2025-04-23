import { Dataset } from '../entities/Dataset.js';
import { DatasetFacets } from '../facets/DatasetFacets.js';

/**
 * Builder for creating Dataset instances.
 */
export class DatasetBuilder {
  private name: string | null = null;
  private namespace: string | null = null;
  private facets: DatasetFacets | Record<string, unknown> = {};

  /**
   * Sets the name of the dataset.
   * @param name - The name of the dataset.
   * @returns The builder instance for method chaining.
   */
  setName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * Sets the namespace of the dataset.
   * @param namespace - The namespace of the dataset.
   * @returns The builder instance for method chaining.
   */
  setNamespace(namespace: string): this {
    this.namespace = namespace;
    return this;
  }

  /**
   * Sets the facets of the dataset.
   * @param facets - The facets of the dataset.
   * @returns The builder instance for method chaining.
   */
  setFacets(facets: DatasetFacets): this {
    this.facets = facets;
    return this;
  }

  /**
   * Builds and returns a Dataset instance.
   * @returns The constructed Dataset.
   * @throws {Error} If required fields (name, namespace) are missing.
   */
  build(): Dataset {
    if (!this.name || !this.namespace) {
      throw new Error('Name and Namespace are required');
    }
    return new Dataset(this.name, this.namespace, this.facets);
  }
}
