import { BaseFacet } from './BaseFacet.js';
import validator from 'validator';
import { ProcessingType } from '../types/CommonTypes.js';


// Owner class
export class Owner {
	constructor(public name: string, public type: string) {}
}

// JobFacet class
export class JobFacet extends BaseFacet {
	_deleted: boolean | null;

	constructor(producer: string, schemaURL: string, deleted: boolean | null = null) {
		super(producer, schemaURL);
		this._deleted = deleted;
	}
}

// JobType class
export class JobType extends JobFacet {
	processingType: ProcessingType;
	integration: string;
	jobType: string;

	constructor(
			producer: string,
			schemaURL: string,
			processingType: ProcessingType,
			integration: string,
			jobType: string,
			deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.processingType = processingType;
		this.integration = integration;
		this.jobType = jobType;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/JobTypeJobFacet.json';
	}
}

// Ownership class
export class Ownership extends JobFacet {
	ownership: Owner[];

	constructor(producer: string, schemaURL: string, owners: Owner[], deleted: boolean | null = null) {
		super(producer, schemaURL, deleted);
		this.ownership = owners;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/OwnershipJobFacet.json';
	}
}

// SourceCode class
export class SourceCode extends JobFacet {
	language: string;
	sourceCode: string;

	constructor(
			producer: string,
			schemaURL: string,
			language: string,
			sourceCode: string,
			deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.language = language;
		this.sourceCode = sourceCode;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/SourceCodeJobFacet.json';
	}
}

// SourceCodeLocation class
export class SourceCodeLocation extends JobFacet {
	type: string;
	url: string;
	repoUrl: string;
	path: string;
	version: string;
	tag: string;
	branch: string;

	constructor(
			producer: string,
			schemaURL: string,
			type: string,
			url: string,
			repoUrl: string,
			path: string,
			version: string,
			tag: string,
			branch: string,
			deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);

		if (!validator.isURL(url) || !validator.isURL(repoUrl)) {
			throw new Error('URL and repoUrl must be valid URLs');
		}

		this.type = type;
		this.url = url;
		this.repoUrl = repoUrl;
		this.path = path;
		this.version = version;
		this.tag = tag;
		this.branch = branch;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/SourceCodeLocationJobFacet.json';
	}
}

// Sql class
export class Sql extends JobFacet {
	query: string;

	constructor(producer: string, schemaURL: string, query: string, deleted: boolean | null = null) {
		super(producer, schemaURL, deleted);
		this.query = query;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/SqlJobFacet.json';
	}
}

// Documentation class
export class Documentation extends JobFacet {
	description: string;

	constructor(
			producer: string,
			schemaURL: string,
			description: string,
			deleted: boolean | null = null
	) {
		super(producer, schemaURL, deleted);
		this.description = description;
	}

	getSchema(): string {
		return 'https://openlineage.io/spec/facets/1-0-0/DocumentationJobFacet.json';
	}
}

// JobFacets class
export class JobFacets {
	documentation: Documentation | null;
	ownership: Ownership | null;
	sourceCode: SourceCode | null;
	sourceCodeLocation: SourceCodeLocation | null;
	sql: Sql | null;
	jobType: JobType | null;

	constructor(
			documentation: Documentation | null = null,
			ownership: Ownership | null = null,
			sourceCode: SourceCode | null = null,
			sourceCodeLocation: SourceCodeLocation | null = null,
			sql: Sql | null = null,
			jobType: JobType | null = null
	) {
		this.documentation = documentation;
		this.ownership = ownership;
		this.sourceCode = sourceCode;
		this.sourceCodeLocation = sourceCodeLocation;
		this.sql = sql;
		this.jobType = jobType;
	}
}