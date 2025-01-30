import {
  Documentation,
  JobFacets,
  JobType,
  Ownership,
  Sql,
  SourceCode,
  SourceCodeLocation,
} from '../facets/JobFacets.js';

// JobFacetsBuilder class
export class JobFacetsBuilder {
  private _documentation: Documentation | null = null;
  private _ownership: Ownership | null = null;
  private _sourceCode: SourceCode | null = null;
  private _sourceCodeLocation: SourceCodeLocation | null = null;
  private _sql: Sql | null = null;
  private _jobType: JobType | null = null;

  setDocumentation(documentation: Documentation | null): this {
    this._documentation = documentation;
    return this;
  }

  setOwnership(ownership: Ownership | null): this {
    this._ownership = ownership;
    return this;
  }

  setSourceCode(sourceCode: SourceCode | null): this {
    this._sourceCode = sourceCode;
    return this;
  }

  setSourceCodeLocation(sourceCodeLocation: SourceCodeLocation | null): this {
    this._sourceCodeLocation = sourceCodeLocation;
    return this;
  }

  setSql(sql: Sql | null): this {
    this._sql = sql;
    return this;
  }

  setJobType(jobType: JobType | null): this {
    this._jobType = jobType;
    return this;
  }

  build(): JobFacets {
    return new JobFacets(
      this._documentation,
      this._ownership,
      this._sourceCode,
      this._sourceCodeLocation,
      this._sql,
      this._jobType,
    );
  }
}
