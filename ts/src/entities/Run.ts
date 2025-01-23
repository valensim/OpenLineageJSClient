import { RunFacets } from "../facets/RunFacets";

/**
 * Represents a run.
 */
export class Run {
	runId: string;
	facets: RunFacets | Record<string, unknown>;

	constructor(runId: string, facets: RunFacets | Record<string, unknown> = {}) {
		this.runId = runId;
		this.facets = facets;
	}
}