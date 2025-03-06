import {
  OutputDatasetFacets,
  OutputStatistics,
} from '../facets/OutputDatasetFacets.js';

/**
 * Builder for creating OutputDatasetFacets instances.
 */
export class OutputDatasetFacetsBuilder {
  private outputStatistics: OutputStatistics | null = null;

  setOutputStatistics(outputStatistics: OutputStatistics): this {
    this.outputStatistics = outputStatistics;
    return this;
  }

  build(): OutputDatasetFacets {
    return new OutputDatasetFacets(this.outputStatistics);
  }
}

/**
 * Builder for creating OutputStatistics instances.
 */
export class OutputStatisticsBuilder {
  private producer: string;
  private schemaURL: string;
  private rowCount: number = 0;
  private fileCount: number = 0;
  private size: number = 0;

  constructor(producer: string, schemaURL: string) {
    this.producer = producer;
    this.schemaURL = schemaURL;
  }

  setRowCount(rowCount: number): this {
    this.rowCount = rowCount;
    return this;
  }

  setFileCount(fileCount: number): this {
    this.fileCount = fileCount;
    return this;
  }

  setSize(size: number): this {
    this.size = size;
    return this;
  }

  build(): OutputStatistics {
    return new OutputStatistics(
      this.producer,
      this.schemaURL,
      this.rowCount,
      this.fileCount,
      this.size,
    );
  }
}
