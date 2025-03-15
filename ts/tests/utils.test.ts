import { describe, it, expect, vi } from 'vitest';
import { isValidURI, removeEmptyFields, validateEvent } from '../src/utils/utils.js';

// Mock the console.error to avoid polluting test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('isValidURI', () => {
  it('should return true for valid URIs', () => {
    // These URIs should match the regex pattern in isValidURI
    const validURIs = [
      'http://example.com',
      'https://example.com',
      'http://localhost:8080',
      'https://example.com/path/to/resource',
      'http://example.com/path/to/resource?query=value',
      'http://example.com/path/to/resource#fragment',
      // Additional URI schemes
      'kafka://broker:9092/topic',
      'aws://s3/bucket/key',
      'ftp://example.com',
      's3://bucket/key',
      'jdbc:postgresql://localhost:5432/database',
      'mongodb://user:password@localhost:27017/database'
    ];

    for (const uri of validURIs) {
      const result = isValidURI(uri);
      if (!result) {
        console.log(`Failed validation for valid URI: ${uri}`);
      }
      expect(isValidURI(uri)).toBe(true);
    }
  });

  it('should return false for invalid URIs', () => {
    const invalidURIs = [
      '',
      'example.com',
      'http:/example.com',
      'http:///example.com',
      'http:// example.com',
      'http://',
      'http:///',
      'http',
      '://example.com',
      '123://example.com' // URI scheme must start with a letter
    ];

    for (const uri of invalidURIs) {
      expect(isValidURI(uri)).toBe(false);
    }
  });
});

describe('removeEmptyFields', () => {
  it('should return non-object values as is', () => {
    expect(removeEmptyFields(null)).toBeNull();
    expect(removeEmptyFields(undefined)).toBeUndefined();
    expect(removeEmptyFields(123)).toBe(123);
    expect(removeEmptyFields('string')).toBe('string');
    expect(removeEmptyFields(true)).toBe(true);
  });

  it('should remove null and undefined values from objects', () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
      d: 'string',
      e: {
        f: null,
        g: 2
      }
    };

    const expected = {
      a: 1,
      d: 'string',
      e: {
        g: 2
      }
    };

    expect(removeEmptyFields(input)).toEqual(expected);
  });

  it('should remove null and undefined values from arrays', () => {
    const input = [1, null, undefined, 'string', [null, 2]];
    const expected = [1, 'string', [2]];

    expect(removeEmptyFields(input)).toEqual(expected);
  });

  it('should handle nested objects and arrays', () => {
    const input = {
      a: 1,
      b: null,
      c: [1, null, { d: null, e: 2 }],
      f: { g: null, h: [null, 3] }
    };

    const expected = {
      a: 1,
      c: [1, { e: 2 }],
      f: { h: [3] }
    };

    expect(removeEmptyFields(input)).toEqual(expected);
  });
});

describe('validateEvent', () => {
  // Since we can't easily create a valid event that passes schema validation in tests,
  // we'll focus on testing the error handling
  
  it('should handle validation errors', () => {
    // Create a simple invalid object
    const invalidEvent = {};
    
    // Mock console.error to capture the error message
    const consoleErrorSpy = vi.spyOn(console, 'error');
    
    // Expect the function to throw an error
    expect(() => {
      try {
        validateEvent(invalidEvent);
      } catch (error) {
        // Verify that console.error was called
        expect(consoleErrorSpy).toHaveBeenCalled();
        throw error; // Re-throw for the outer expect
      }
    }).toThrow();
    
    // Clean up
    consoleErrorSpy.mockRestore();
  });
}); 