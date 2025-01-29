import { InputDataset } from "../entities/InputDataset.js";
import { DatasetFacets } from "../facets/DatasetFacets.js";
import { InputDatasetFacets } from "../facets/InputDatasetFacets.js";

/**
 * Builder for creating InputDataset instances.
 */
export class InputDatasetBuilder {
  private name: string | null = null;
  private namespace: string | null = null;
  private facets: DatasetFacets | Record<string, unknown> = {};
  private inputFacets: InputDatasetFacets | Record<string, unknown> = {};

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setNamespace(namespace: string): this {
    this.namespace = namespace;
    return this;
  }

  setFacets(facets: DatasetFacets): this {
    this.facets = facets;
    return this;
  }

  setInputFacets(inputFacets: InputDatasetFacets): this {
    this.inputFacets = inputFacets;
    return this;
  }

  build(): InputDataset {
    if (!this.name || !this.namespace) {
      throw new Error("Name and Namespace are required");
    }
    return new InputDataset(this.name, this.namespace, this.facets, this.inputFacets);
  }
}