const axios = require('axios');
const { instanceToPlain } = require('class-transformer');
const Ajv = require('ajv').default;
const addFormats = require('ajv-formats').default;
const schema = require('../schemas/eventSchema.json');

/**
 * Removes empty fields from an object recursively.
 * @param {Object} obj
 * @returns {Object} New object with non-empty fields
 */
function removeEmptyFields(obj) {
  if (obj === null || typeof obj !== 'object') {
	return obj;
  }

  return Object.fromEntries(
	  Object.entries(obj)
	  .map(([key, value]) => [key, removeEmptyFields(value)])
	  .filter(([_, value]) => value !== null && value !== undefined)
  );
}


const https = require('https');

// Create an https agent that ignores SSL certificate validation
const httpsAgent = new https.Agent({rejectUnauthorized: false});

/**
 * Fetches a JSON schema from a given URL.
 * @param {string} url - The URL to fetch the schema from.
 * @returns {Promise<Object>} - The JSON schema object.
 */
async function fetchJsonSchema(url) {
  try {
	const response = await axios.get(url, {httpsAgent});
	return response.data;
  } catch (error) {
	throw new Error(
		`Failed to fetch JSON schema from ${url}: ${error.message}`);
  }
}

/**
 * Validates a JSON object against a fetched JSON schema.
 * @param {Object} jsonObject - The JSON object to validate.
 * @returns {boolean} - Resolves to true if valid, otherwise throws an error.
 */
function validateEvent(jsonObject) {
  try {
	// Convert the RunEvent to JSON
	const eventJson = instanceToPlain(jsonObject);

	delete schema.$schema;

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

  } catch (error) {
	console.log(error)
	throw new Error(`Validation failed: ${error.message}`);
  }
}

/**
 * Validates a JSON object against a fetched JSON schema.
 * @param {Object} jsonObject - The JSON object to validate.
 * @param {string} schema - The URL of the JSON schema to validate against.
 * @returns {Promise<boolean>} - Resolves to true if valid, otherwise throws an error.
 */
async function validateJsonAgainstSchema(jsonObject, schema) {
  try {
	// Convert the RunEvent to JSON
	const eventJson = instanceToPlain(jsonObject);
	const schema = await fetchJsonSchema(schemaUrl);

	delete schema.$schema;

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

  } catch (error) {
	console.log(error)
	throw new Error(`Validation failed: ${error.message}`);
  }
}

module.exports = {
  removeEmptyFields: removeEmptyFields,
  fetchJsonSchema: fetchJsonSchema,
  validateEvent: validateEvent,
  validateJsonAgainstSchema: validateJsonAgainstSchema,
};