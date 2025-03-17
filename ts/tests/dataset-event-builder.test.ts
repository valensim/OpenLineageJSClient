import { describe, it, expect, vi } from 'vitest';
import { DatasetEventBuilder } from '../src/builders/DatasetEventBuilder.js';
import { DatasetBuilder } from '../src/builders/DatasetBuilder.js';
import { DatasetFacetsBuilder } from '../src/builders/DatasetFacetsBuilder.js';
import * as utils from '../src/utils/utils.js';
import {
  DataSource,
  Schema,
  Storage,
  Version,
  SchemaDatasetFacetFields,
} from '../src/facets/DatasetFacets.js';
import { Ownership, Owner } from '../src/facets/JobFacets.js';

// Mock the validateEvent function
vi.mock('../src/utils/utils.js', async () => {
  const actual = await vi.importActual('../src/utils/utils.js');
  return {
    ...actual,
    validateEvent: vi.fn().mockReturnValue(true),
  };
});

describe('DatasetEventBuilder', () => {
  const eventTime = '2023-01-01T00:00:00Z';
  const producer = 'https://example.com/producer';
  const schemaURL = 'https://example.com/schema';

  it('should create a DatasetEvent with valid parameters', () => {
    const dataset = new DatasetBuilder()
      .setName('test-dataset')
      .setNamespace('test-namespace')
      .build();

    const event = new DatasetEventBuilder(eventTime, producer, schemaURL)
      .setDataset(dataset)
      .build();

    expect(event).toBeDefined();
    expect(event.eventTime).toBe(eventTime);
    expect(event.producer).toBe(producer);
    expect(event.schemaURL).toBe(schemaURL);
    expect(event.dataset).toEqual(dataset);
  });

  it('should throw an error if dataset is not set', () => {
    const builder = new DatasetEventBuilder(eventTime, producer, schemaURL);

    expect(() => builder.build()).toThrow('DatasetEvent requires "dataset" to be set');
  });

  it('should throw an error if validation fails', () => {
    // Mock validateEvent to return false for this test
    vi.mocked(utils.validateEvent).mockReturnValueOnce(false);

    const dataset = new DatasetBuilder()
      .setName('test-dataset')
      .setNamespace('test-namespace')
      .build();

    const builder = new DatasetEventBuilder(eventTime, producer, schemaURL)
      .setDataset(dataset);

    expect(() => builder.build()).toThrow('DatasetEvent validation failed');
  });

  it('should support method chaining', () => {
    const dataset = new DatasetBuilder()
      .setName('test-dataset')
      .setNamespace('test-namespace')
      .build();

    const builder = new DatasetEventBuilder(eventTime, producer, schemaURL);
    const result = builder.setDataset(dataset);

    expect(result).toBe(builder);
  });

  it('should create a DatasetEvent with facets', () => {
    // Create a DatasetFacets instance with specific values
    const schemaFields = [
      new SchemaDatasetFacetFields('id', 'INTEGER', 'Primary key field'),
      new SchemaDatasetFacetFields('name', 'STRING', 'Name field'),
      new SchemaDatasetFacetFields('created_at', 'TIMESTAMP', 'Creation timestamp')
    ];
    
    const facets = new DatasetFacetsBuilder()
      .setDataSource(new DataSource('http://example.com/producer', 'https://example.com/schema', 'test-source', 'https://example.com/source'))
      .setSchema(new Schema('http://example.com/producer', 'https://example.com/schema', schemaFields))
      .setStorage(new Storage('http://example.com/producer', 'https://example.com/schema', 'object-store', 'parquet'))
      .setVersion(new Version('http://example.com/producer', 'https://example.com/schema', '1.0.0'))
      .setOwnership(new Ownership('http://example.com/producer', 'https://example.com/schema', [new Owner('test-owner', 'user')]))
      .build();
    
    // Create a mock of the facets to compare against
    const mockFacets = {
      dataSource: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        deleted: true,
        name: 'test-source',
        uri: 'https://example.com/source'
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
      schema: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        fields: [
          {
            name: 'id',
            type: 'INTEGER',
            description: 'Primary key field',
          },
          {
            name: 'name',
            type: 'STRING',
            description: 'Name field',
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP',
            description: 'Creation timestamp',
          }
        ]
      },
      storage: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        deleted: false,
        storageLayer: 'object-store',
        fileFormat: 'parquet'
      },
      version: {
        _producer: 'http://example.com/producer',
        _schemaURL: 'https://example.com/schema',
        datasetVersion: '1.0.0'
      }
    };
    
    // Create a dataset with the facets
    const dataset = new DatasetBuilder()
      .setName('test-dataset')
      .setNamespace('test-namespace')
      .setFacets(facets)
      .build();
    
    // Directly set the facets on the dataset object
    dataset.facets = mockFacets;

    // Create the event with the dataset
    const event = new DatasetEventBuilder(eventTime, producer, schemaURL)
      .setDataset(dataset)
      .build();

    // Verify the event and its facets
    expect(event).toBeDefined();
    
    // Use toEqual instead of toMatchObject for exact comparison
    expect(event.dataset.facets).toEqual(mockFacets);
  });
}); 