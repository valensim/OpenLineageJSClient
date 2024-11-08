import {BaseFacet} from "./base-facet";

class OutputDatasetFacets {
  /**
   *
   * @param {OutputStatistics | null} outputStatistics
   */
  constructor(outputStatistics = null) {
	this.outputStatistics = outputStatistics;
  }
}

class OutputStatistics extends BaseFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {number} rowCount
   * @param {number} fileCount
   * @param {number} size
   */
  constructor(producer, schemaURL, rowCount, fileCount, size) {
	super(producer, schemaURL);
	this.rowCount = rowCount;
	this.fileCount = fileCount;
	this.size = size;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-2/OutputStatisticsOutputDatasetFacet.json";
  }
}

export {OutputDatasetFacets, OutputStatistics};