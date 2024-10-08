const {BaseFacet, BaseFacetBuilder} = require("./BaseFacet");
const {Ownership} = require("./JobFacets");
const {TransformationType, FieldTransformationType} = require("../types");

class DatasetFacets {
  /**
   * @constructor
   * @param {ColumnLineage | null} columnLineage
   * @param {DataSource | null} dataSource
   * @param {DataQualityAssertions | null} dataQualityAssertions
   * @param {LifecycleStateChange | null} lifecycleStateChange
   * @param {Ownership | null} ownership
   * @param {Schema | null} schema
   * @param {Storage | null} storage
   * @param {Symlinks | null} symlinks
   * @param {Version | null} version
   */
  constructor(columnLineage = null, dataSource = null,
	  dataQualityAssertions = null, lifecycleStateChange = null,
	  ownership = null, schema = null, storage = null, symlinks = null,
	  version = null) {
	this.columnLineage = columnLineage;
	this.dataSource = dataSource;
	this.dataQualityAssertions = dataQualityAssertions;
	this.lifecycleStateChange = lifecycleStateChange;
	this.ownership = ownership;
	this.schema = schema;
	this.storage = storage;
	this.symlinks = symlinks;
	this.version = version;
  }
}

class DatasetFacet extends BaseFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, deleted = null) {
	super(producer, schemaURL);
	this._deleted = deleted;
  }
}

/**
 * @class
 * @schema https://openlineage.io/spec/facets/1-1-0/ColumnLineageDatasetFacet.json
 */
class ColumnLineage extends DatasetFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {{}} fields
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, fields = {}, deleted = null) {
	super(producer, schemaURL, deleted);
	this.fields = fields;
  }

  /**
   *
   * @param {string} key
   * @param {{}} field
   */
  addField(key, field) {
	this.fields = {...this.fields, [key]: field};
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-1-0/ColumnLineageDatasetFacet.json";
  }
}

class Field {
  /**
   * @param {Item[]} inputFields
   * @param {string | null} transformationDescription
   * @param {FieldTransformationType | null} transformationType
   */
  constructor(inputFields, transformationDescription = null, transformationType = null) {
	this.inputFilelds = inputFields;
	this.transformationDescription = transformationDescription;
	this.transformationType = transformationType;
  }
}

class Item {
  /**
   * @param {string} namespace
   * @param {string} name
   * @param {string} field
   * @param {Transformation[] | null} transformations
   */
  constructor(namespace, name, field, transformations = null) {
	this.namespace = namespace;
	this.name = name;
	this.field = field;
	this.transformations = transformations;
  }
}

class Transformation {
  /**
   * @param {TransformationType} type
   * @param {string | null} subtype
   * @param {string | null} description
   * @param {boolean | null} masking
   */
  constructor(type, subtype = null, description = null, masking = null) {
	this.type = type;
	this.subtype = subtype;
	this.description = description;
	this.masking = masking;
  }
}

class DataSource extends DatasetFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} name
   * @param {string} url
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, name, url, deleted = null) {
	super(producer, schemaURL, deleted);
	this.name = name;
	this.url = url;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/DataSourceDatasetFacet.json";
  }
}

class DataQualityAssertions extends DatasetFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {Assertion[]} assertions
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, assertions, deleted = null) {
	super(producer, schemaURL, deleted);
	this.assertions = assertions;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/DataQualityAssertionsDatasetFacet.json";
  }
}

class Assertion {
  /**
   * @constructor
   * @param {string} assertion
   * @param {boolean} success
   * @param {string} column
   */
  constructor(assertion, success, column) {
	this.assertion = assertion;
	this.success = success;
	this.column = column;
  }
}

class LifecycleStateChange extends DatasetFacet {
  /**
   *
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} lifecycleStateChange
   * @param {PreviousIdentifier | null} previousIdentifier
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, lifecycleStateChange,
	  previousIdentifier = null, deleted = null) {
	super(producer, schemaURL, deleted);
	this.lifecycleStateChange = lifecycleStateChange;
	this.previousIdentifier = previousIdentifier;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/LifecycleStateChangeDatasetFacet.json";
  }
}

class PreviousIdentifier {
  /**
   * @param {string} namespace
   * @param {string} name
   */
  constructor(namespace, name) {
	this.namespace = namespace;
	this.name = name;
  }
}

class Schema extends DatasetFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {SchemaDatasetFacetFields[]} fields
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, fields, deleted = null) {
	super(producer, schemaURL, deleted);
	this.fields = fields;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-1-1/SchemaDatasetFacet.json";
  }
}

class SchemaDatasetFacetFields {
  /**
   * @constructor
   * @param {string} name
   * @param {string | null} type
   * @param {string | null} description
   * @param {SchemaDatasetFacetFields [] | null} fields
   */
  constructor(name, type = null, description = null, fields = null) {
	this.name = name;
	this.type = type;
	this.description = description;
	this.fields = fields;
  }
}

class Storage extends DatasetFacet {
  /**
   * @constructor
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} storageLayer
   * @param {string | null} fileFormat
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, storageLayer, fileFormat = null,
	  deleted = null) {
	super(producer, schemaURL, deleted);
	this.storageLayer = storageLayer;
	this.fileFormat = fileFormat;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/StorageDatasetFacet.json";
  }
}

class Symlinks extends DatasetFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {Identifier[]} identifiers
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, identifiers, deleted = null) {
	super(producer, schemaURL, deleted);
	this.identifiers = identifiers;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/SymlinksDatasetFacet.json";
  }
}

class Identifier {
  /**
   * @param {string} namespace
   * @param {string} name
   * @param {string} type
   */
  constructor(namespace, name, type) {
	this.namespace = namespace;
	this.name = name;
	this.type = type;
  }
}

class Version extends DatasetFacet {
  /**
   * @param {string} producer
   * @param {string} schemaURL
   * @param {string} datasetVersion
   * @param {boolean | null} deleted
   */
  constructor(producer, schemaURL, datasetVersion, deleted = null) {
	super(producer, schemaURL, deleted);
	this.datasetVersion = datasetVersion;
  }

  /**
   * @returns {string}
   */
  getSchema() {
	return "https://openlineage.io/spec/facets/1-0-0/DatasetVersionDatasetFacet.json";
  }
}

class DatasetFacetsBuilder{
  constructor() {
	this.columnLineage = null;
	this.dataSource = null;
	this.dataQualityAssertions = null;
	this.lifecycleStateChange = null;
	this.ownership = null;
	this.schema = null;
	this.storage = null;
	this.symlinks = null;
	this.version = null;
  }

  /**
   * @param {ColumnLineage} columnLineage
   * @returns {DatasetFacetsBuilder}
   */
  setColumnLineage(columnLineage) {
	this.columnLineage = columnLineage;
	return this;
  }

  /**
   * @param {DataSource} dataSource
   * @returns {DatasetFacetsBuilder}
   */
  setDataSource(dataSource) {
	this.dataSource = dataSource;
	return this;
  }

  /**
   * @param {DataQualityAssertions} assertions
   * @returns {DatasetFacetsBuilder}
   */
  setDataQualityAssertions(assertions) {
	this.dataQualityAssertions = assertions;
	return this;
  }

  /**
   * @param {LifecycleStateChange} lifecycleStateChange
   * @returns {DatasetFacetsBuilder}
   */
  setLifecycleStateChange(lifecycleStateChange) {
	this.lifecycleStateChange = lifecycleStateChange;
	return this;
  }

  /**
   * @param {Ownership} ownership
   * @returns {DatasetFacetsBuilder}
   */
  setOwnership(ownership) {
	this.ownership = ownership;
	return this;
  }

  /**
   * @param {Schema} schema
   * @returns {DatasetFacetsBuilder}
   */
  setSchema(schema) {
	this.schema = schema;
	return this;
  }

  /**
   * @param {Storage} storage
   * @returns {DatasetFacetsBuilder}
   */
  setStorage(storage) {
	this.storage = storage;
	return this;
  }

  /**
   * @param {Symlinks} symlinks
   * @returns {DatasetFacetsBuilder}
   */
  setSymlinks(symlinks) {
	this.symlinks = symlinks;
	return this;
  }

  /**
   * @param {Version} version
   * @returns {DatasetFacetsBuilder}
   */
  setVersion(version) {
	this.version = version;
	return this;
  }

  /**
   * @returns {DatasetFacets}
   */
  build() {
	return new DatasetFacets(
		this.columnLineage, this.dataSource, this.dataQualityAssertions,
		this.lifecycleStateChange, this.ownership, this.schema, this.storage,
		this.symlinks, this.version);
  }
}

module.exports = {DatasetFacetsBuilder, DatasetFacets, Ownership, ColumnLineage, Field, Item, Transformation, DataSource, DataQualityAssertions, Assertion, LifecycleStateChange, PreviousIdentifier, Schema, SchemaDatasetFacetFields, Storage, Symlinks, Identifier, Version};