import {
  InputDatasetFacets,
  DataQualityMetrics,
  ColumnMetrics,
} from '../facets/InputDatasetFacets.js';

/**
 * Builder for creating InputDatasetFacets instances.
 */
export class InputDatasetFacetsBuilder {
  private dataQualityMetrics: DataQualityMetrics | null = null;

  setDataQualityMetrics(dataQualityMetrics: DataQualityMetrics): this {
    this.dataQualityMetrics = dataQualityMetrics;
    return this;
  }

  build(): InputDatasetFacets {
    return new InputDatasetFacets(this.dataQualityMetrics);
  }
}

/**
 * Builder for creating DataQualityMetrics instances.
 */
export class DataQualityMetricsBuilder {
  private producer: string;
  private schemaURL: string;
  private columnMetrics: Record<string, ColumnMetrics> = {};
  private rowCount: number | null = null;
  private bytes: number | null = null;
  private fileCount: number | null = null;

  constructor(producer: string, schemaURL: string) {
    this.producer = producer;
    this.schemaURL = schemaURL;
  }

  addColumnMetrics(key: string, columnMetrics: ColumnMetrics): this {
    this.columnMetrics[key] = columnMetrics;
    return this;
  }

  setRowCount(rowCount: number): this {
    this.rowCount = rowCount;
    return this;
  }

  setBytes(bytes: number): this {
    this.bytes = bytes;
    return this;
  }

  setFileCount(fileCount: number): this {
    this.fileCount = fileCount;
    return this;
  }

  build(): DataQualityMetrics {
    return new DataQualityMetrics(
      this.producer,
      this.schemaURL,
      this.columnMetrics,
      this.rowCount,
      this.bytes,
      this.fileCount,
    );
  }
}

/**
 * Builder for creating ColumnMetrics instances.
 */
export class ColumnMetricsBuilder {
  private nullCount: number = 0;
  private distinctCount: number = 0;
  private sum: number = 0;
  private count: number = 0;
  private min: number = 0;
  private max: number = 0;
  private quantiles: Record<string, number> = {};

  setNullCount(nullCount: number): this {
    this.nullCount = nullCount;
    return this;
  }

  setDistinctCount(distinctCount: number): this {
    this.distinctCount = distinctCount;
    return this;
  }

  setSum(sum: number): this {
    this.sum = sum;
    return this;
  }

  setCount(count: number): this {
    this.count = count;
    return this;
  }

  setMin(min: number): this {
    this.min = min;
    return this;
  }

  setMax(max: number): this {
    this.max = max;
    return this;
  }

  addQuantile(key: string, value: number): this {
    this.quantiles[key] = value;
    return this;
  }

  build(): ColumnMetrics {
    return new ColumnMetrics(
      this.nullCount,
      this.distinctCount,
      this.sum,
      this.count,
      this.min,
      this.max,
      this.quantiles,
    );
  }
}
