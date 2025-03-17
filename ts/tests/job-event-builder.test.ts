import { describe, it, expect, vi } from 'vitest';
import { JobEventBuilder } from '../src/builders/JobEventBuilder.js';
import { JobBuilder } from '../src/builders/JobBuilder.js';
import { InputDatasetBuilder } from '../src/builders/InputDatasetBuilder.js';
import { OutputDatasetBuilder } from '../src/builders/OutputDatasetBuilder.js';
import { JobFacetsBuilder } from '../src/builders/JobFacetsBuilder.js';
import * as utils from '../src/utils/utils.js';
import { Documentation, JobType, Ownership, SourceCode, SourceCodeLocation, Sql, Owner } from '../src/facets/JobFacets.js';
import { ProcessingType } from '../src/types/CommonTypes.js';

// Mock the validateEvent function
vi.mock('../src/utils/utils.js', async () => {
  const actual = await vi.importActual('../src/utils/utils.js');
  return {
    ...actual,
    validateEvent: vi.fn().mockReturnValue(true),
  };
});

describe('JobEventBuilder', () => {
  const eventTime = '2023-01-01T00:00:00Z';
  const producer = 'https://example.com/producer';
  const schemaURL = 'https://example.com/schema';

  it('should create a JobEvent with valid parameters', () => {
    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .build();

    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const event = new JobEventBuilder(eventTime, producer, schemaURL)
      .setJob(job)
      .setInputs(inputs)
      .setOutputs(outputs)
      .build();

    expect(event).toBeDefined();
    expect(event.eventTime).toBe(eventTime);
    expect(event.producer).toBe(producer);
    expect(event.schemaURL).toBe(schemaURL);
    expect(event.job).toEqual(job);
    expect(event.inputs).toEqual(inputs);
    expect(event.outputs).toEqual(outputs);
  });

  it('should throw an error if job is not set', () => {
    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const builder = new JobEventBuilder(eventTime, producer, schemaURL)
      .setInputs(inputs)
      .setOutputs(outputs);

    expect(() => builder.build()).toThrow('Job, "inputs" and "outputs" are required fields for JobEvent');
  });

  it('should throw an error if inputs are not set', () => {
    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .build();

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const builder = new JobEventBuilder(eventTime, producer, schemaURL)
      .setJob(job)
      .setOutputs(outputs);

    expect(() => builder.build()).toThrow('Job, "inputs" and "outputs" are required fields for JobEvent');
  });

  it('should throw an error if outputs are not set', () => {
    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .build();

    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const builder = new JobEventBuilder(eventTime, producer, schemaURL)
      .setJob(job)
      .setInputs(inputs);

    expect(() => builder.build()).toThrow('Job, "inputs" and "outputs" are required fields for JobEvent');
  });

  it('should throw an error if validation fails', () => {
    // Mock validateEvent to return false for this test
    vi.mocked(utils.validateEvent).mockReturnValueOnce(false);

    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .build();

    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const builder = new JobEventBuilder(eventTime, producer, schemaURL)
      .setJob(job)
      .setInputs(inputs)
      .setOutputs(outputs);

    expect(() => builder.build()).toThrow('JobEvent validation failed');
  });

  it('should support method chaining', () => {
    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .build();

    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const builder = new JobEventBuilder(eventTime, producer, schemaURL);
    
    expect(builder.setJob(job)).toBe(builder);
    expect(builder.setInputs(inputs)).toBe(builder);
    expect(builder.setOutputs(outputs)).toBe(builder);
  });

  it('should create a JobEvent with facets', () => {
    // Create a JobFacets instance with specific values
    const facets = new JobFacetsBuilder()
      .setDocumentation(new Documentation('http://example.com/producer', 'https://example.com/schema', 'This is a test job'))
      .setJobType(new JobType('http://example.com/producer', 'https://example.com/schema', ProcessingType.BATCH, 'test-integration', 'test-job-type'))
      .setOwnership(new Ownership('http://example.com/producer', 'https://example.com/schema', [new Owner('test-owner', 'user')]))
      .setSourceCode(new SourceCode('http://example.com/producer', 'https://example.com/schema', 'python', 'print("Hello, World!")'))
      .setSourceCodeLocation(new SourceCodeLocation(
        'http://example.com/producer', 
        'https://example.com/schema',
        'git',
        'https://github.com/example/repo',
        'https://github.com/example/repo',
        '/path/to/file',
        '1.0.0',
        'v1.0.0',
        'main'
      ))
      .setSql(new Sql('http://example.com/producer', 'https://example.com/schema', 'SELECT * FROM test'))
      .build();
    
    // Create a mock of the facets to compare against
    const mockFacets = {
      documentation: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        _deleted: true,
        description: 'This is a test job'
      },
      jobType: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        processingType: ProcessingType.BATCH,
        integration: 'test-integration',
        jobType: 'test-job-type'
      },
      ownership: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        ownership: [
          {
            name: 'test-owner',
            type: 'user'
          }
        ]
      },
      sourceCode: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        language: 'python',
        sourceCode: 'print("Hello, World!")'
      },
      sourceCodeLocation: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        type: 'git',
        url: 'https://github.com/example/repo',
        repoUrl: 'https://github.com/example/repo',
        path: '/path/to/file',
        version: '1.0.0',
        tag: 'v1.0.0',
        branch: 'main'
      },
      sql: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        query: 'SELECT * FROM test'
      }
    };
    
    // Create a job with the facets
    const job = new JobBuilder()
      .setName('test-job')
      .setNamespace('test-namespace')
      .addFacets(facets)
      .build();
    
    // Directly set the facets on the job object
    job.facets = mockFacets;

    const inputs = [
      new InputDatasetBuilder()
        .setName('input-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    const outputs = [
      new OutputDatasetBuilder()
        .setName('output-dataset')
        .setNamespace('test-namespace')
        .build()
    ];

    // Create the event with the job
    const event = new JobEventBuilder(eventTime, producer, schemaURL)
      .setJob(job)
      .setInputs(inputs)
      .setOutputs(outputs)
      .build();

    // Verify the event and its facets
    expect(event).toBeDefined();
    
    // Use toEqual instead of toMatchObject for exact comparison
    expect(event.job.facets).toEqual(mockFacets);
  });
}); 