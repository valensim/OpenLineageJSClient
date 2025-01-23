import { Run } from "../entities/Run";
import { RunFacets } from "../facets/RunFacets";

/**
 * Builder for creating Run instances.
 */
export class RunBuilder {
  private runId: string | null = null;
  private facets: RunFacets | Record<string, unknown> = {};

  setRunId(runId: string): this {
    this.runId = runId;
    return this;
  }

  addRunFacets(facets: RunFacets): this {
    this.facets = facets;
    return this;
  }

  build(): Run {
    if (!this.runId) {
      throw new Error("Run ID is required");
    }
    return new Run(this.runId, this.facets);
  }
}