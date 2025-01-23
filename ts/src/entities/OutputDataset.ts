import { Dataset } from "./Dataset";
import { DatasetFacets } from "../facets/DatasetFacets";
import { OutputDatasetFacets } from "../facets/OutputDatasetFacets";

/**
 * Represents an output dataset.
 */
export class OutputDataset extends Dataset {
  outputFacets: OutputDatasetFacets | Record<string, unknown>;

  constructor(
    name: string,
    namespace: string,
    facets: DatasetFacets | Record<string, unknown> = {},
    outputFacets: OutputDatasetFacets | Record<string, unknown> = {}
  ) {
    super(name, namespace, facets);
    this.outputFacets = outputFacets;
  }
}