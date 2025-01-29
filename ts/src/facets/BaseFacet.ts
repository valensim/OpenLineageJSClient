import { isValidURI } from '../utils/utils.js'; // Assuming this utility exists

/**
 * BaseFacet class
 * All facets must extend this base class.
 */
export class BaseFacet {
	_producer: string;
	_schemaURL: string;

	constructor(producer: string, schemaURL: string) {
		if (!isValidURI(producer) || !isValidURI(schemaURL)) {
			throw new Error('Invalid URL');
		}
		this._producer = producer;
		this._schemaURL = schemaURL;
	}
}