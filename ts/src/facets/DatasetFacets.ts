import { BaseFacet } from './BaseFacet.js';
import { isValidURI } from '../utils/utils.js';
import {Ownership} from './JobFacets.js';
import {FieldTransformationType, TransformationType} from '../types/CommonTypes.js';

/**
 * Represents the facets of a dataset.
 */
export class DatasetFacets {
	columnLineage: ColumnLineage | null;
	dataSource: DataSource | null;
	dataQualityAssertions: DataQualityAssertions | null;
	lifecycleStateChange: LifecycleStateChange | null;
	ownership: Ownership | null;
	schema: Schema | null;
	storage: Storage | null;
	symlinks: Symlinks | null;
	version: Version | null;

	constructor(
		columnLineage: ColumnLineage | null = null,
		dataSource: DataSource | null = null,
		dataQualityAssertions: DataQualityAssertions | null = null,
		lifecycleStateChange: LifecycleStateChange | null = null,
		ownership: Ownership | null = null,
		schema: Schema | null = null,
		storage: Storage | null = null,
		symlinks: Symlinks | null = null,
		version: Version | null = null
	) {
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

/**
 * Represents a dataset facet.
 */
export class DatasetFacet extends BaseFacet {
	deleted: boolean | null;

	constructor(producer: string, schemaURL: string, deleted: boolean | null = null) {
		super(producer, schemaURL);
		this.deleted = deleted;
	}
}

/**
 * Represents a column lineage facet.
 */
export class ColumnLineage extends DatasetFacet {
	fields: Record<string, Field>;

	constructor(
		producer: string,
		schemaURL: string,
		fields: Record<string, Field> = {},
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.fields = fields;
	}

	addField(key: string, field: Field): void {
		this.fields = { ...this.fields, [key]: field };
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-1-0/ColumnLineageDatasetFacet.json';
	}
}

/**
 * Represents a field in column lineage.
 */
export class Field {
	inputFields: Item[];
	transformationDescription: string | null;
	transformationType: FieldTransformationType | null;

	constructor(
		inputFields: Item[],
		transformationDescription: string | null = null,
		transformationType: FieldTransformationType | null = null
	) {
		this.inputFields = inputFields;
		this.transformationDescription = transformationDescription;
		this.transformationType = transformationType;
	}
}

/**
 * Represents an item in a field.
 */
export class Item {
	namespace: string;
	name: string;
	field: string;
	transformations: Transformation[] | null;

	constructor(
		namespace: string,
		name: string,
		field: string,
		transformations: Transformation[] | null = null
	) {
		this.namespace = namespace;
		this.name = name;
		this.field = field;
		this.transformations = transformations;
	}
}

/**
 * Represents a transformation.
 */
export class Transformation {
	type: TransformationType;
	subtype: string | null;
	description: string | null;
	masking: boolean | null;

	constructor(
		type: TransformationType,
		subtype: string | null = null,
		description: string | null = null,
		masking: boolean | null = null
	) {
		this.type = type;
		this.subtype = subtype;
		this.description = description;
		this.masking = masking;
	}
}

/**
 * Represents a data source facet.
 */
export class DataSource extends DatasetFacet {
	name: string;
	uri: string;

	constructor(
		producer: string,
		schemaURL: string,
		name: string,
		uri: string,
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		if (!isValidURI(uri)) {
			throw new Error('uri must be a valid URL');
		}
		this.name = name;
		this.uri = uri;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/DataSourceDatasetFacet.json';
	}
}

/**
 * Represents data quality assertions.
 */
export class DataQualityAssertions extends DatasetFacet {
	assertions: Assertion[];

	constructor(
		producer: string,
		schemaURL: string,
		assertions: Assertion[],
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.assertions = assertions;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/DataQualityAssertionsDatasetFacet.json';
	}
}

/**
 * Represents an assertion.
 */
export class Assertion {
	assertion: string;
	success: boolean;
	column: string;

	constructor(assertion: string, success: boolean, column: string) {
		this.assertion = assertion;
		this.success = success;
		this.column = column;
	}
}

/**
 * Represents a lifecycle state change facet.
 */
export class LifecycleStateChange extends DatasetFacet {
	lifecycleStateChange: string;
	previousIdentifier: PreviousIdentifier | null;

	constructor(
		producer: string,
		schemaURL: string,
		lifecycleStateChange: string,
		previousIdentifier: PreviousIdentifier | null = null,
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.lifecycleStateChange = lifecycleStateChange;
		this.previousIdentifier = previousIdentifier;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/LifecycleStateChangeDatasetFacet.json';
	}
}

/**
 * Represents a previous identifier.
 */
export class PreviousIdentifier {
	namespace: string;
	name: string;

	constructor(namespace: string, name: string) {
		this.namespace = namespace;
		this.name = name;
	}
}

/**
 * Represents a schema facet.
 */
export class Schema extends DatasetFacet {
	fields: SchemaDatasetFacetFields[];

	constructor(
		producer: string,
		schemaURL: string,
		fields: SchemaDatasetFacetFields[],
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.fields = fields;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-1-1/SchemaDatasetFacet.json';
	}
}

/**
 * Represents fields in a schema dataset facet.
 */
export class SchemaDatasetFacetFields {
	name: string;
	type: string | null;
	description: string | null;
	fields: SchemaDatasetFacetFields[] | null;

	constructor(
		name: string,
		type: string | null = null,
		description: string | null = null,
		fields: SchemaDatasetFacetFields[] | null = null
	) {
		this.name = name;
		this.type = type;
		this.description = description;
		this.fields = fields;
	}
}

/**
 * Represents a storage facet.
 */
export class Storage extends DatasetFacet {
	storageLayer: string;
	fileFormat: string | null;

	constructor(
		producer: string,
		schemaURL: string,
		storageLayer: string,
		fileFormat: string | null = null,
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.storageLayer = storageLayer;
		this.fileFormat = fileFormat;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/StorageDatasetFacet.json';
	}
}

/**
 * Represents a symlinks facet.
 */
export class Symlinks extends DatasetFacet {
	identifiers: Identifier[];

	constructor(
		producer: string,
		schemaURL: string,
		identifiers: Identifier[],
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.identifiers = identifiers;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/SymlinksDatasetFacet.json';
	}
}

/**
 * Represents an identifier.
 */
export class Identifier {
	namespace: string;
	name: string;
	type: string;

	constructor(namespace: string, name: string, type: string) {
		this.namespace = namespace;
		this.name = name;
		this.type = type;
	}
}

/**
 * Represents a version facet.
 */
export class Version extends DatasetFacet {
	datasetVersion: string;

	constructor(
		producer: string,
		schemaURL: string,
		datasetVersion: string,
		deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.datasetVersion = datasetVersion;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/DatasetVersionDatasetFacet.json';
	}
}