import { BaseFacet } from "./BaseFacet";

/**
 * Represents the facets of an input dataset.
 */
export class InputDatasetFacets {
  dataQualityMetrics: DataQualityMetrics | null;

  constructor(dataQualityMetrics: DataQualityMetrics | null = null) {
    this.dataQualityMetrics = dataQualityMetrics;
  }
}

/**
 * Represents data quality metrics for an input dataset.
 */
export class DataQualityMetrics extends BaseFacet {
  columnMetrics: Record<string, ColumnMetrics>;
  rowCount: number | null;
  bytes: number | null;
  fileCount: number | null;

  constructor(
    producer: string,
    schemaURL: string,
    columnMetrics: Record<string, ColumnMetrics> = {},
    rowCount: number | null = null,
    bytes: number | null = null,
    fileCount: number | null = null
  ) {
    super(producer, schemaURL);
    this.columnMetrics = columnMetrics;
    this.rowCount = rowCount;
    this.bytes = bytes;
    this.fileCount = fileCount;
  }

  /**
   * Adds column metrics to the dataset.
   * @param key - The key for the column metrics.
   * @param columnMetrics - The column metrics to add.
   */
  addColumnMetrics(key: string, columnMetrics: ColumnMetrics): void {
    this.columnMetrics = { ...this.columnMetrics, [key]: columnMetrics };
  }

  /**
   * Returns the schema URL for the data quality metrics.
   */
  getSchema(): string {
    return "https://openlineage.io/spec/facets/1-0-2/DataQualityMetricsInputDatasetFacet.json";
  }
}

/**
 * Represents metrics for a specific column.
 */
export class ColumnMetrics {
  nullCount: number;
  distinctCount: number;
  sum: number;
  count: number;
  min: number;
  max: number;
  quantiles: Record<string, number>;

  constructor(
    nullCount: number,
    distinctCount: number,
    sum: number,
    count: number,
    min: number,
    max: number,
    quantiles: Record<string, number>
  ) {
    this.nullCount = nullCount;
    this.distinctCount = distinctCount;
    this.sum = sum;
    this.count = count;
    this.min = min;
    this.max = max;
    this.quantiles = quantiles;
  }

  /**
   * Adds a quantile to the column metrics.
   * @param key - The key for the quantile.
   * @param value - The value of the quantile.
   */
  addQuantile(key: string, value: number): void {
    this.quantiles = { ...this.quantiles, [key]: value };
  }
}