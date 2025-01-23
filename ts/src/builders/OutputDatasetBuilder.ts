import { OutputDataset } from "../entities/OutputDataset";
import { DatasetFacets } from "../facets/DatasetFacets";
import { OutputDatasetFacets } from "../facets/OutputDatasetFacets";

/**
 * Builder for creating OutputDataset instances.
 */
export class OutputDatasetBuilder {
  private name: string | null = null;
  private namespace: string | null = null;
  private facets: DatasetFacets | Record<string, unknown> = {};
  private outputFacets: OutputDatasetFacets | Record<string, unknown> = {};

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

  setOutputFacets(outputFacets: OutputDatasetFacets): this {
    this.outputFacets = outputFacets;
    return this;
  }

  build(): OutputDataset {
    if (!this.name || !this.namespace) {
      throw new Error("Name and Namespace are required");
    }
    return new OutputDataset(this.name, this.namespace, this.facets, this.outputFacets);
  }
}