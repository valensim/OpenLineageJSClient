import {instanceToPlain} from 'class-transformer';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/eventSchema.json';

/**
 * Removes empty fields from an object recursively.
 * @param {Object} obj
 * @returns {Object} New object with non-empty fields
 */
function removeEmptyFields(obj) {
  if (obj === null || typeof obj !== 'object') {
	return obj;
  }

  if (Array.isArray(obj)) {
	return obj
	.map(removeEmptyFields)
	.filter(value => value !== null && value !== undefined);
  }

  return Object.fromEntries(
	  Object.entries(obj)
	  .map(([key, value]) => [key, removeEmptyFields(value)])
	  .filter(([_, value]) => value !== null && value !== undefined)
  );
}

/**
 * Validates a JSON object against a fetched JSON schema.
 * @param {Object} jsonObject - The JSON object to validate.
 * @returns {boolean} - Resolves to true if valid, otherwise throws an error.
 */
function validateEvent(jsonObject) {
  // Convert the RunEvent to JSON
  const eventJson = instanceToPlain(jsonObject);

  const ajv = new Ajv({
	strict: false,
	ignoreKeywordsWithRef: true // This option is useful to ignore $schema references.
  });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const valid = validate(eventJson);
  if (!valid) {
	console.error('Validation errors:', validate.errors);
	throw new Error('JSON object does not comply with the schema');
  }
  return true;

}

export {removeEmptyFields, validateEvent};