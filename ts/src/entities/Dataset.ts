import { DatasetFacets } from "../facets/DatasetFacets";

/**
 * Represents a generic dataset.
 */
export class Dataset {
	name: string;
	namespace: string;
	facets: DatasetFacets | Record<string, unknown>;

	constructor(name: string, namespace: string, facets: DatasetFacets | Record<string, unknown> = {}) {
		this.name = name;
		this.namespace = namespace;
		this.facets = facets;
	}
}