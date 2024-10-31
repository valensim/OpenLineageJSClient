import {Dataset} from "./Datasets";
import {DatasetFacets} from "./facets/DatasetFacets";
import {OutputDatasetFacets} from "./facets/OutputDatasetFacets";

/**
 * @class
 * @extends Dataset
 */
class OutputDataset extends Dataset {
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
  constructor(name = null, namespace = null) {
	this.name = name;
	this.namespace = namespace;
	this.facets = {};
	this.inputFacets = {};
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
	return new OutputDataset(this.name, this.namespace, this.facets,
		this.outputFacets);
  }
}

export {OutputDatasetBuilder, OutputDataset};