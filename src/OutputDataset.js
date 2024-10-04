const { Dataset } = require("./Datasets");
const { DatasetFacets } = require("./facets/DatasetFacets");
const { OutputDatasetFacets } = require("./facets/OutputDatasetFacets");

/**
 * @class
 * @extends Dataset
 */
class OutputDataset extends Dataset{
  /**
   *
   * @param {string} name
   * @param {string} namespace
   * @param {DatasetFacets | {}} facets
   * @param {OutputDatasetFacets | {}} outputFacets
   */
  constructor(name, namespace, facets = {}, outputFacets = {}) {
	super(name, namespace, facets);
	this.outputFacets = outputFacets;
  }
}



class OutputDatasetBuilder {
  constructor() {
	this.name = null;
	this.namespace = null;
	this.facets = {};
	this.outputFacets = {};
  }

  /**
   *
   * @param {string} name
   * @returns {OutputDatasetBuilder}
   */
  setName(name) {
	this.name = name;
	return this;
  }

  /**
   * @param {string} namespace
   * @returns {OutputDatasetBuilder}
   */
  setNamespace(namespace) {
	this.namespace = namespace;
	return this;
  }

  /**
   * @param {DatasetFacets} facets
   * @returns {OutputDatasetBuilder}
   */
  setFacets(facets) {
	this.facets = facets;
	return this;
  }

  /**
   * @param {OutputDatasetFacets} facets
   * @returns {OutputDatasetBuilder}
   */
  setOutputFacet(facets) {
	this.outputFacets = facets;
	return this;
  }

  build() {
	if (!this.name || !this.namespace) {
	  throw new Error('Name and Namespace are required');
	}
	return new OutputDataset(this.name, this.namespace, this.facets, this.outputFacets);
  }
}

module.exports = {OutputDatasetBuilder, OutputDataset};