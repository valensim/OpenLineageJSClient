import { Dataset } from "./Dataset.js";
import { DatasetFacets } from "../facets/DatasetFacets.js";
import { InputDatasetFacets } from "../facets/InputDatasetFacets.js";

/**
 * Represents an input dataset.
 */
export class InputDataset extends Dataset {
  inputFacets: InputDatasetFacets | Record<string, unknown>;

  constructor(
    name: string,
    namespace: string,
    facets: DatasetFacets | Record<string, unknown> = {},
    inputFacets: InputDatasetFacets | Record<string, unknown> = {}
  ) {
    super(name, namespace, facets);
    this.inputFacets = inputFacets;
  }
}