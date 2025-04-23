import { isValidURI } from '../utils/utils.js'; // Assuming this utility exists

/**
 * Abstract base class for all OpenLineage facets.
 * Provides common properties required by the OpenLineage specification for facets.
 * See https://openlineage.io/spec/facets/
 */
export class BaseFacet {
  /**
   * URI identifying the producer of this facet. E.g., \"https://github.com/OpenLineage/OpenLineage/tree/0.0.1/integration/spark\"
   * @see https://openlineage.io/docs/spec/facets/
   */
  _producer: string;
  /**
   * The version of the OpenLineage schema used for this facet. E.g., \"https://openlineage.io/spec/1-0-0/OpenLineage.json#/definitions/BaseFacet\"
   * @see https://openlineage.io/docs/spec/facets/
   */
  _schemaURL: string;

  /**
   * Constructs a BaseFacet.
   *
   * @param producer - URI identifying the producer of this facet.
   * @param schemaURL - The URL pointing to the specific version of the OpenLineage schema for this facet.
   * @throws {Error} If the producer or schemaURL is not a valid URI.
   */
  constructor(producer: string, schemaURL: string) {
    if (!isValidURI(producer) || !isValidURI(schemaURL)) {
      throw new Error('Invalid URL');
    }
    this._producer = producer;
    this._schemaURL = schemaURL;
  }
}
