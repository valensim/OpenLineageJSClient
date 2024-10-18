const { BaseFacet } = require("./BaseFacet");
const validator = require("validator");

class JobFacets {
  /**
   * @constructor
   * @param {Documentation | null} [documentation]
   * @param {Ownership | null} [ownership]
   * @param {SourceCode | null} [sourceCode]
   * @param {SourceCodeLocation | null} [sourceCodeLocation]
   * @param {Sql | null} [sql]
   * @param {JobType | null} [jobType]
   */
  constructor(documentation, ownership, sourceCode, sourceCodeLocation,  sql, jobType) {
	this.documentation = documentation || null;
	this.ownership = ownership || null;
	this.sourceCode = sourceCode || null;
	this.sourceCodeLocation = sourceCodeLocation || null;
	this.sql = sql || null;
	this.jobType = jobType || null;
  }
}

class JobFacet extends BaseFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, deleted = null) {
	super(producer, schemaURL);
	this._deleted = deleted;
  }
}

class JobType extends JobFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {string} processingType
   * @param {string} integration
   * @param {string} jobType
   */
  constructor(producer, schemaURL, processingType, integration, jobType, deleted = null) {
	super(producer, schemaURL, deleted);
	this.processingType = processingType;
	this.integration = integration;
	this.jobType = jobType;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/JobTypeJobFacet.json"
  }
}

class Owner {
  /**
   * @param {string} name
   * @param {string} type
   */
  constructor(name, type) {
	this.name = name;
	this.type = type;
  }
}

class Ownership extends JobFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {Owner[]} owners
   */
  constructor(producer, schemaURL, owners, deleted = null) {
	super(producer, schemaURL, deleted);
	this.ownership = owners;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/OwnershipJobFacet.json"
  }
}

class SourceCode extends JobFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {string} language
   * @param {string} sourceCode
   */
  constructor(producer, schemaURL, language, sourceCode, deleted = null) {
	super(producer, schemaURL, deleted);
	this.language = language;
	this.sourceCode = sourceCode
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/SourceCodeJobFacet.json"
  }
}

class SourceCodeLocation extends JobFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {string} type
   * @param {string} url
   * @param {string} repoUrl
   * @param {string} path
   * @param {string} version
   * @param {string} tag
   * @param {string} branch
   */
  constructor(producer, schemaURL, type, url, repoUrl, path, version, tag, branch, deleted = null) {
	super(producer, schemaURL, deleted);
	this.type = type;
	if(!validator.isURL(url) || !validator.isURL(repoUrl)) {
	  throw new Error("URL and repoUrl must be valid URLs");
	}
	this.url = url;
	this.repoUrl = repoUrl;
	this.path = path;
	this.version = version;
	this.tag = tag;
	this.branch = branch;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/SourceCodeLocationJobFacet.json"
  }
}

class Sql extends JobFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {string} query
   */
  constructor(producer, schemaURL, query, deleted = null) {
	super(producer, schemaURL, deleted);
	this.query = query;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/SqlJobFacet.json"
  }
}

class Documentation extends JobFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   * @param {string} description
   */
  constructor(producer, schemaURL, description, deleted = null) {
	super(producer, schemaURL, deleted);
	this.description = description;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/DocumentationJobFacet.json"
  }
}

class JobFacetsBuilder {
  constructor() {
	this._documentation = null;
	this._ownership = null;
	this._sourceCode = null;
	this._sourceCodeLocation = null;
	this._sql = null;
	this._jobType = null;
	this._deleted = false;
  }

  /**
   * @param {Documentation | null} documentation
   * @returns {JobFacetsBuilder}
   */
  setDocumentation(documentation) {
	this._documentation = documentation;
	return this;
  }

  /**
   * @param {Ownership | null} ownership
   * @returns {JobFacetsBuilder}
   */
  setOwnership(ownership) {
	this._ownership = ownership;
	return this;
  }

  /**
   * @param {SourceCode | null} sourceCode
   * @returns {JobFacetsBuilder}
   */
  setSourceCode(sourceCode) {
	this._sourceCode = sourceCode;
	return this;
  }

  /**
   * @param {SourceCodeLocation | null} sourceCodeLocation
   * @returns {JobFacetsBuilder}
   */
  setSourceCodeLocation(sourceCodeLocation) {
	this._sourceCodeLocation = sourceCodeLocation;
	return this;
  }

  /**
   * @param {Sql | null} sql
   * @returns {JobFacetsBuilder}
   */
  setSql(sql) {
	this._sql = sql;
	return this;
  }

  /**
   * @param {JobType | null} jobType
   * @returns {JobFacetsBuilder}
   */
  setJobType(jobType) {
	this._jobType = jobType;
	return this;
  }

  build() {
	return new JobFacets(this._documentation, this._ownership, this._sourceCode, this._sourceCodeLocation, this._sql, this._jobType);
  }
}
module.exports = {JobFacets, JobFacetsBuilder, JobType, Documentation, Sql, Ownership, SourceCode, SourceCodeLocation, Owner}