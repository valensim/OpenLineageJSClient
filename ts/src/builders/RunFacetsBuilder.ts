import { RunFacets, ErrorMessage, ExternalQuery, NominalTime, Parent } from '../facets/RunFacets';

/**
 * Builder for creating RunFacets instances.
 */
export class RunFacetsBuilder {
  private _errorMessage: ErrorMessage | null = null;
  private _externalQuery: ExternalQuery | null = null;
  private _nominalTime: NominalTime | null = null;
  private _parent: Parent | null = null;

  setErrorMessage(errorMessage: ErrorMessage | null): this {
    this._errorMessage = errorMessage;
    return this;
  }

  setExternalQuery(externalQuery: ExternalQuery | null): this {
    this._externalQuery = externalQuery;
    return this;
  }

  setNominalTime(nominalTime: NominalTime | null): this {
    this._nominalTime = nominalTime;
    return this;
  }

  setParent(parent: Parent | null): this {
    this._parent = parent;
    return this;
  }

  build(): RunFacets {
    return new RunFacets(
      this._errorMessage,
      this._externalQuery,
      this._nominalTime,
      this._parent
    );
  }
}