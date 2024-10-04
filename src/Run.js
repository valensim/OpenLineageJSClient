const { RunFacets } = require("./facets/RunFacets");

/**
 * @class
 */
class Run{
  /**
   *
   * @param {string} runId
   * @param {{}} facets
   */
  constructor(runId, facets = {}) {
		this.runId = runId;
		this.facets = facets;
  }
}

class RunBuilder {
  constructor() {
	this.runId = null;
	this.facets = {};
  }

  /**
   * @param {string} runId
   * @returns {RunBuilder}
   */
  setRunId(runId) {
	this.runId = runId;
	return this;
  }

  /**
   * @param {RunFacets} facets
   * @returns {RunBuilder}
   */
  addRunFacets(facets) {
	this.facets = facets;
	return this;
  }

  build() {
	if (!this.runId) {
	  throw new Error('Run ID is required');
	}
	// Clean up facets to remove null or undefined fields
	return new Run(this.runId, this.facets);
  }
}

module.exports = {Run, RunBuilder};
