const validator = require('validator');
/**
 * @class
 * all the facets has to have these
 */
class BaseFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   */
  constructor(producer, schemaURL) {
	if(!validator.isURL(schemaURL) || !validator.isURL(producer)){
	  throw new Error('Invalid URL');
	}
	this._producer = producer;
	this._schemaURL = schemaURL;
  }
}

class BaseFacetBuilder {
  constructor() {
	this._producer = null;
	this._schemaURL = null;
  }

  /**
   * @param {string} producer
   * @returns {BaseFacetBuilder}
   */
  setProducer(producer) {
	this._producer = producer;
	return this;
  }

  /**
   * @param {string} schemaURL
   * @returns {BaseFacetBuilder}
   */
  setSchemaURL(schemaURL) {
	this._schemaURL = schemaURL;
	return this;
  }

  build() {
	if (!this._producer || !this._schemaURL) {
	  throw new Error('Producer and schemaURL are required fields for BaseFacet');
	}
	return new BaseFacet(this._producer, this._schemaURL);
  }
}

module.exports = {BaseFacet, BaseFacetBuilder};
