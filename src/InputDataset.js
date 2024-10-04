const { Dataset } = require("./Datasets");
const { DatasetFacets } = require("./facets/DatasetFacets");
const { InputDatasetFacets } = require("./facets/InputDatasetFacets");

/**
 * @class
 * @extends Dataset
 */
class InputDataset extends Dataset{
  /**
   *
   * @param {string} name
   * @param {string} namespace
   * @param {DatasetFacets | {}} facets
   * @param {InputDatasetFacets | {}} inputFacets
   */
  constructor(name, namespace, facets = {}, inputFacets = {}) {
	super(name, namespace, facets);
	this.inputFacets = inputFacets;
  }
}

class InputDatasetBuilder {
  constructor() {
	this.name = null;
	this.namespace = null;
	this.facets = {};
	this.inputFacets = {};
  }

  /**
   * @param {string} name
   * @returns {InputDatasetBuilder}
   */
  setName(name) {
	this.name = name;
	return this;
  }

  /**
   * @param {string} namespace
   * @returns {InputDatasetBuilder}
   */
  setNamespace(namespace) {
	this.namespace = namespace;
	return this;
  }

  /**
   * @param {DatasetFacets} facets
   * @returns {InputDatasetBuilder}
   */
  setFacets(facets) {
	this.facets = facets;
	return this;
  }

  /**
   * @param {InputDatasetFacets} facets
   * @returns {InputDatasetBuilder}
   */
  setInputFacets(facets) {
	this.inputFacets = facets;
	return this;
  }

  build() {
	if (!this.name || !this.namespace || !this.inputFacets) {
	  throw new Error('Name and Namespace are required');
	}
	return new InputDataset(this.name, this.namespace, this.facets, this.inputFacets);
  }
}

module.exports = {
  InputDataset,
  InputDatasetBuilder,
};