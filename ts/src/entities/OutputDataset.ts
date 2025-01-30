import { Dataset } from './Dataset.js';
import { DatasetFacets } from '../facets/DatasetFacets.js';
import { OutputDatasetFacets } from '../facets/OutputDatasetFacets.js';

/**
 * Represents an output dataset.
 */
export class OutputDataset extends Dataset {
  outputFacets: OutputDatasetFacets | Record<string, unknown>;

  constructor(
    name: string,
    namespace: string,
    facets: DatasetFacets | Record<string, unknown> = {},
    outputFacets: OutputDatasetFacets | Record<string, unknown> = {},
  ) {
    super(name, namespace, facets);
    this.outputFacets = outputFacets;
  }
}
