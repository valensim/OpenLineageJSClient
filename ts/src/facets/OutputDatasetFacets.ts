import { BaseFacet } from './BaseFacet.js';

/**
 * Represents the facets of an output dataset.
 */
export class OutputDatasetFacets {
  outputStatistics: OutputStatistics | null;

  constructor(outputStatistics: OutputStatistics | null = null) {
    this.outputStatistics = outputStatistics;
  }
}

/**
 * Represents output statistics for an output dataset.
 */
export class OutputStatistics extends BaseFacet {
  rowCount: number;
  fileCount: number;
  size: number;

  constructor(
    producer: string,
    schemaURL: string,
    rowCount: number,
    fileCount: number,
    size: number,
  ) {
    super(producer, schemaURL);
    this.rowCount = rowCount;
    this.fileCount = fileCount;
    this.size = size;
  }

  /**
   * Returns the schema URL for the output statistics.
   */
  getSchema(): string {
    return 'https://openlineage.io/spec/facets/1-0-2/OutputStatisticsOutputDatasetFacet.json';
  }
}
