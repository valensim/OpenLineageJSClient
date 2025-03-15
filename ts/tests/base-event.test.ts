import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseEvent } from '../src/events/BaseEvent.js';
import * as utils from '../src/utils/utils.js';

// Mock the isValidURI function
vi.mock('../src/utils/utils.js', () => ({
  isValidURI: vi.fn()
}));

describe('BaseEvent', () => {
  const validEventTime = '2023-01-01T00:00:00Z';
  const validProducer = 'http://producer.com';
  const validSchemaURL = 'http://schema.com';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(utils.isValidURI).mockReturnValue(true);
  });

  describe('constructor', () => {
    it('should create a BaseEvent with valid parameters', () => {
      const event = new BaseEvent(validEventTime, validProducer, validSchemaURL);
      
      expect(event.eventTime).toBe(validEventTime);
      expect(event.producer).toBe(validProducer);
      expect(event.schemaURL).toBe(validSchemaURL);
      expect(utils.isValidURI).toHaveBeenCalledTimes(2);
      expect(utils.isValidURI).toHaveBeenCalledWith(validSchemaURL);
      expect(utils.isValidURI).toHaveBeenCalledWith(validProducer);
    });

    it('should throw an error if schemaURL is invalid', () => {
      vi.mocked(utils.isValidURI).mockImplementation((url) => url !== validSchemaURL);
      
      expect(() => new BaseEvent(validEventTime, validProducer, validSchemaURL))
        .toThrow('Invalid URL');
      
      expect(utils.isValidURI).toHaveBeenCalledWith(validSchemaURL);
    });

    it('should throw an error if producer is invalid', () => {
      vi.mocked(utils.isValidURI).mockImplementation((url) => url !== validProducer);
      
      expect(() => new BaseEvent(validEventTime, validProducer, validSchemaURL))
        .toThrow('Invalid URL');
      
      expect(utils.isValidURI).toHaveBeenCalledWith(validProducer);
    });
  });

  describe('getSchema', () => {
    it('should return the correct schema URL', () => {
      const event = new BaseEvent(validEventTime, validProducer, validSchemaURL);
      
      expect(event.getSchema()).toBe('https://openlineage.io/spec/2-0-2/OpenLineage.json');
    });
  });
}); 