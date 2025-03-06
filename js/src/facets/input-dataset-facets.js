import {BaseFacet} from "./base-facet.js";

class InputDatasetFacets {

  /**
   * @param {DataQualityMetrics | null} dataQualityMetrics
   */
  constructor(dataQualityMetrics = null) {
	this.dataQualityMetrics = dataQualityMetrics
  }
}

/**
 * @class
 * @schema https://openlineage.io/spec/facets/1-0-2/DataQualityMetricsInputDatasetFacet.json
 */
class DataQualityMetrics extends BaseFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {{}} columnMetrics
   * @param {number | null} rowCount
   * @param {number | null} bytes
   * @param {number | null} fileCount
   */
  constructor(producer, schemaURL, columnMetrics = {}, rowCount, bytes,
	  fileCount) {
	super(producer, schemaURL);
	this.columnMetrics = columnMetrics;
	this.rowCount = rowCount;
	this.bytes = bytes;
	this.fileCount = fileCount;
  }

  /**
   * @param {string} key
   * @param {ColumnMetrics} columnMetrics
   */
  addColumnMetrics(key, columnMetrics) {
	this.columnMetrics = {...this.columnMetrics, [key]: columnMetrics};
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-2/DataQualityMetricsInputDatasetFacet.json";
  }

}

class ColumnMetrics {
  /**
   * @param {number} nullCount
   * @param {number} distinctCount
   * @param {number} sum
   * @param {number} count
   * @param {number} min
   * @param {number} max
   * @param {{}} quantiles
   */
  constructor(nullCount, distinctCount, sum, count, min, max, quantiles) {
	this.nullCount = nullCount;
	this.distinctCount = distinctCount;
	this.sum = sum;
	this.count = count;
	this.min = min;
	this.max = max;
	this.quantiles = quantiles;
  }

  /**
   * @param {string} key
   * @param {number} value
   */
  addQuantile(key, value) {
	this.quantiles = {...this.quantiles, [key]: value};
  }

}

export {InputDatasetFacets, DataQualityMetrics, ColumnMetrics};