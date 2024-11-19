import {instanceToPlain} from 'class-transformer';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = JSON.parse(
	await readFile(
		join(__dirname, '../schemas/event-schema.json'),
		'utf8'
	)
);

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