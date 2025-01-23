import { Dataset } from "./Dataset";
import { DatasetFacets } from "../facets/DatasetFacets";
import { InputDatasetFacets } from "../facets/InputDatasetFacets";

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