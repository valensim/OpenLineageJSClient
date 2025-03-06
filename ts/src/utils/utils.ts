import { instanceToPlain } from 'class-transformer';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/event-schema.js';

/**
 * Validates whether a string is a valid URI.
 * @param uri - The URI to validate.
 * @returns True if the URI is valid, false otherwise.
 */
export function isValidURI(uri: string): boolean {
  const uriRegex = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/;
  return uriRegex.test(uri);
}

/**
 * Removes empty fields from an object recursively.
 * @param obj - The object to clean.
 * @returns A new object with non-empty fields.
 */
export function removeEmptyFields<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(removeEmptyFields)
      .filter((value) => value !== null && value !== undefined) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, removeEmptyFields(value)])
      .filter(([_, value]) => value !== null && value !== undefined),
  ) as T;
}

/**
 * Validates a JSON object against the OpenLineage schema.
 * @param jsonObject - The JSON object to validate.
 * @returns True if the object is valid, otherwise throws an error.
 */
export function validateEvent(jsonObject: object): boolean {
  const eventJson = instanceToPlain(jsonObject);

  const ajv = new Ajv({ strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const valid = validate(eventJson);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    throw new Error('JSON object does not comply with the schema');
  }
  return true;
}
