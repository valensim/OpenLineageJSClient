import {JobFacets} from "./facets/job-facets";

/**
 * @class
 */
class Job {
  /**
   * @param {string} namespace
   * @param {string} name
   * @param {JobFacets | null | {}} facets
   */
  constructor(namespace, name, facets) {
	this.namespace = namespace;
	this.name = name;
	this.facets = facets;
  }
}

class JobBuilder {
  constructor() {
	this.namespace = null;
	this.name = null;
	this.facets = {};
  }

  /**
   *
   * @param {string} namespace
   * @returns {JobBuilder}
   */
  setNamespace(namespace) {
	this.namespace = namespace;
	return this;
  }

  /**
   * @param {string} name
   * @returns {JobBuilder}
   */
  setName(name) {
	this.name = name;
	return this;
  }

  /**
   * @param {JobFacets} facets
   * @returns {JobBuilder}
   */
  addFacets(facets) {
	this.facets = facets;
	return this;
  }

  build() {
	if (!this.namespace || !this.name) {
	  throw new Error('Namespace and Job Name are required');
	}
	return new Job(this.namespace, this.name, this.facets);
  }
}

export {Job, JobBuilder};