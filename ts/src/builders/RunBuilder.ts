import { Run } from '../entities/Run.js';
import { RunFacets } from '../facets/RunFacets.js';

/**
 * Builder for creating Run instances.
 */
export class RunBuilder {
  private runId: string | null = null;
  private facets: RunFacets | Record<string, unknown> = {};

  /**
   * Sets the unique identifier for the run.
   * @param runId - The run ID (UUID recommended).
   * @returns The builder instance for method chaining.
   */
  setRunId(runId: string): this {
    this.runId = runId;
    return this;
  }

  /**
   * Sets the facets for the run.
   * @param facets - An object containing run facets.
   * @returns The builder instance for method chaining.
   */
  addRunFacets(facets: RunFacets): this {
    this.facets = facets;
    return this;
  }

  /**
   * Builds the Run instance.
   *
   * @returns The constructed Run.
   * @throws {Error} If the required field (runId) is missing.
   */
  build(): Run {
    if (!this.runId) {
      throw new Error('Run ID is required');
    }
    return new Run(this.runId, this.facets);
  }
}
