import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RunEvent } from '../src/events/RunEvent.js';
import { EventType } from '../src/types/EventTypes.js';
import { Run } from '../src/entities/Run.js';
import { Job } from '../src/entities/Job.js';
import { InputDataset } from '../src/entities/InputDataset.js';
import { OutputDataset } from '../src/entities/OutputDataset.js';
import * as utils from '../src/utils/utils.js';

// Mock the isValidURI and removeEmptyFields functions
vi.mock('../src/utils/utils.js', () => ({
  isValidURI: vi.fn().mockReturnValue(true),
  removeEmptyFields: vi.fn((obj) => obj)
}));

describe('RunEvent', () => {
  const validEventTime = '2023-01-01T00:00:00Z';
  const validProducer = 'http://producer.com';
  const validSchemaURL = 'http://schema.com';
  const validEventType = EventType.START;
  let validRun: Run;
  let validJob: Job;
  let validInputs: InputDataset[];
  let validOutputs: OutputDataset[];

  beforeEach(() => {
    vi.clearAllMocks();
    validRun = new Run('run-id-123');
    validJob = new Job('test-namespace', 'test-job');
    validInputs = [new InputDataset('input-dataset', 'input-namespace')];
    validOutputs = [new OutputDataset('output-dataset', 'output-namespace')];
  });

  describe('constructor', () => {
    it('should create a RunEvent with valid parameters', () => {
      const event = new RunEvent(
        validEventTime,
        validProducer,
        validSchemaURL,
        validEventType,
        validRun,
        validJob,
        validInputs,
        validOutputs
      );
      
      expect(event.eventTime).toBe(validEventTime);
      expect(event.producer).toBe(validProducer);
      expect(event.schemaURL).toBe(validSchemaURL);
      expect(event.eventType).toBe(validEventType);
      expect(event.run).toBe(validRun);
      expect(event.job).toBe(validJob);
      expect(event.inputs).toBe(validInputs);
      expect(event.outputs).toBe(validOutputs);
      
      // Verify that removeEmptyFields was called
      expect(utils.removeEmptyFields).toHaveBeenCalledTimes(1);
      expect(utils.removeEmptyFields).toHaveBeenCalledWith(event);
    });

    it('should inherit validation from BaseEvent', () => {
      vi.mocked(utils.isValidURI).mockReturnValueOnce(false);
      
      expect(() => new RunEvent(
        validEventTime,
        validProducer,
        validSchemaURL,
        validEventType,
        validRun,
        validJob,
        validInputs,
        validOutputs
      )).toThrow('Invalid URL');
      
      expect(utils.isValidURI).toHaveBeenCalled();
    });

    it('should handle different event types', () => {
      const eventTypes = [
        EventType.START,
        EventType.RUNNING,
        EventType.COMPLETE,
        EventType.ABORT,
        EventType.FAIL,
        EventType.OTHER
      ];
      
      for (const type of eventTypes) {
        const event = new RunEvent(
          validEventTime,
          validProducer,
          validSchemaURL,
          type,
          validRun,
          validJob,
          validInputs,
          validOutputs
        );
        
        expect(event.eventType).toBe(type);
      }
    });

    it('should handle empty inputs and outputs arrays', () => {
      const event = new RunEvent(
        validEventTime,
        validProducer,
        validSchemaURL,
        validEventType,
        validRun,
        validJob,
        [],
        []
      );
      
      expect(event.inputs).toEqual([]);
      expect(event.outputs).toEqual([]);
    });
  });
}); 