import { BaseFacet } from './BaseFacet';

/**
 * Represents the facets of a run.
 */
export class RunFacets {
	errorMessage: ErrorMessage | null;
	externalQuery: ExternalQuery | null;
	nominalTime: NominalTime | null;
	parent: Parent | null;

	constructor(
		errorMessage: ErrorMessage | null = null,
		externalQuery: ExternalQuery | null = null,
		nominalTime: NominalTime | null = null,
		parent: Parent | null = null
	) {
		this.errorMessage = errorMessage;
		this.externalQuery = externalQuery;
		this.nominalTime = nominalTime;
		this.parent = parent;
	}
}

/**
 * Represents an error message facet.
 */
export class ErrorMessage extends BaseFacet {
	message: string;
	programmingLanguage: string;
	stackTrace: string | null;

	constructor(
		producer: string,
		schemaURL: string,
		message: string,
		programmingLanguage: string,
		stackTrace: string | null = null
	) {
		super(producer, schemaURL);
		this.message = message;
		this.programmingLanguage = programmingLanguage;
		this.stackTrace = stackTrace;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/ErrorMessageRunFacet.json';
	}
}

/**
 * Represents an external query facet.
 */
export class ExternalQuery extends BaseFacet {
	externalQueryId: string;
	source: string;

	constructor(
		producer: string,
		schemaURL: string,
		externalQueryId: string,
		source: string
	) {
		super(producer, schemaURL);
		this.externalQueryId = externalQueryId;
		this.source = source;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/ExternalQueryRunFacet.json';
	}
}

/**
 * Represents a nominal time facet.
 */
export class NominalTime extends BaseFacet {
	nominalStartTime: string;
	nominalEndTime: string;

	constructor(
		producer: string,
		schemaURL: string,
		nominalStartTime: string,
		nominalEndTime: string
	) {
		super(producer, schemaURL);
		this.nominalStartTime = nominalStartTime;
		this.nominalEndTime = nominalEndTime;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/NominalTimeRunFacet.json';
	}
}

/**
 * Represents a parent facet.
 */
export class Parent extends BaseFacet {
	job: { name: string; namespace: string };
	run: { runId: string };

	constructor(
		producer: string,
		schemaURL: string,
		jobName: string,
		jobNamespace: string,
		runId: string
	) {
		super(producer, schemaURL);
		this.job = { name: jobName, namespace: jobNamespace };
		this.run = { runId: runId };
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/ParentRunFacet.json';
	}
}