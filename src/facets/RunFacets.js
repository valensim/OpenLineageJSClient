const {BaseFacet, BaseFacetBuilder } = require("./BaseFacet");

//TODO handling of what atributes are required and what not according to the documentation viz https://openlineage.io/docs/spec/facets/run-facets/
class RunFacets {
  /**
   * @constructor
   * @param {ErrorMessage | null} errorMessage
   * @param {ExternalQuery | null} externalQuery
   * @param {NominalTime | null} nominalTime
   * @param {Parent | null} parent
   */
  constructor(errorMessage, externalQuery, nominalTime, parent) {
	this.errorMessage = errorMessage || null;
	this.externalQuery = externalQuery || null;
	this.nominalTime = nominalTime || null;
	this.parent = parent || null;
  }
}

class ErrorMessage extends BaseFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} message
   * @param {string} programmingLanguage
   * @param {string | null} stackTrace
   */
  constructor(producer, schemaURL, message, programmingLanguage, stackTrace) {
	super(producer, schemaURL);
	this.message = message;
	this.programmingLanguage = programmingLanguage;
	this.stackTrace = stackTrace || null;
  }
  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/ErrorMessageRunFacet.json"
  }
}

class ExternalQuery extends BaseFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} externalQueryId
   * @param {string} source
   */
  constructor(producer, schemaURL, externalQueryId, source) {
	super(producer, schemaURL);
	this.externalQueryId = externalQueryId;
	this.source = source;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/ExternalQueryRunFacet.json"
  }
}

class NominalTime extends BaseFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} nominalStartTime
   * @param {string} nominalEndTime
   */
  constructor(producer, schemaURL, nominalStartTime, nominalEndTime) {
	super(producer, schemaURL);
	this.nominalStartTime = nominalStartTime;
	this.nominalEndTime = nominalEndTime;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/NominalTimeRunFacet.json"
  }
}

class Parent extends BaseFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} jobName
   * @param {string} jobNamespace
   * @param {string} runId
   */
  constructor(producer, schemaURL, jobName, jobNamespace, runId) {
	super(producer, schemaURL);
	this.job = {name: jobName, namespace: jobNamespace}
	this.run = {runId: runId}
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/ParentRunFacet.json"
  }
}

class RunFacetsBuilder{
  constructor() {
	this._errorMessage = null;
	this._externalQuery = null;
	this._nominalTime = null;
	this._parent = null;
  }

  /**
   * @param {ErrorMessage | null} errorMessage
   * @returns {RunFacetsBuilder}
   */
  setErrorMessage(errorMessage) {
	this._errorMessage = errorMessage;
	return this;
  }
  /**
   * @param {ExternalQuery | null} externalQuery
   * @returns {RunFacetsBuilder}
   */
  setExternalQuery(externalQuery) {
	this._externalQuery = externalQuery;
	return this;
  }
  /**
   * @param {NominalTime | null} nominalTime
   * @returns {RunFacetsBuilder}
   */
  setNominalTime(nominalTime) {
	this._nominalTime = nominalTime;
	return this;
  }
  /**
   * @param {Parent | null} parent
   * @returns {RunFacetsBuilder}
   */
  setParent(parent) {
	this._parent = parent;
	return this;
  }

  build() {
	return new RunFacets(this._errorMessage, this._externalQuery, this._nominalTime, this._parent);
  }
}

module.exports = {RunFacets, RunFacetsBuilder, ErrorMessage, Parent, NominalTime, ExternalQuery};