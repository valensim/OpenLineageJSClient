import { DatasetFacets } from '../facets/DatasetFacets.js';

/**
 * Represents a generic dataset (input or output).
 * A dataset is a collection of data, typically residing in a storage system.
 */
export class Dataset {
  /** The unique name of the dataset within its namespace. */
  name: string;
  /** The namespace uniquely identifying the dataset's source or context (e.g., database, storage account). */
  namespace: string;
  /** Optional collection of facets providing additional metadata about the dataset. */
  facets: DatasetFacets | Record<string, unknown>;

  /**
   * Constructs a new Dataset instance.
   *
   * @param name - The unique name of the dataset within its namespace.
   * @param namespace - The namespace identifying the dataset's source or context.
   * @param facets - Optional collection of dataset facets (default: {}).
   */
  constructor(
    name: string,
    namespace: string,
    facets: DatasetFacets | Record<string, unknown> = {},
  ) {
    this.name = name;
    this.namespace = namespace;
    this.facets = facets;
  }
}
