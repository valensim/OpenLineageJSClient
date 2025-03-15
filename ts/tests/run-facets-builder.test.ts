import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RunFacetsBuilder } from '../src/builders/RunFacetsBuilder.js';
import {
  RunFacets,
  ErrorMessage,
  ExternalQuery,
  NominalTime,
  Parent
} from '../src/facets/RunFacets.js';

// Mock the isValidURI function
vi.mock('../src/utils/utils.js', () => ({
  isValidURI: vi.fn().mockReturnValue(true)
}));

describe('RunFacetsBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a RunFacets instance with default values', () => {
    const facets = new RunFacetsBuilder().build();
    
    expect(facets).toBeInstanceOf(RunFacets);
    expect(facets.errorMessage).toBeNull();
    expect(facets.externalQuery).toBeNull();
    expect(facets.nominalTime).toBeNull();
    expect(facets.parent).toBeNull();
  });
  
  it('should create a RunFacets instance with error message', () => {
    const errorMessage = new ErrorMessage(
      'test-producer',
      'http://schema.com',
      'Test error message',
      'TypeScript'
    );
    
    const facets = new RunFacetsBuilder()
      .setErrorMessage(errorMessage)
      .build();
    
    expect(facets.errorMessage).toBe(errorMessage);
  });
  
  it('should create a RunFacets instance with external query', () => {
    const externalQuery = new ExternalQuery(
      'test-producer',
      'http://schema.com',
      'query-123',
      'test-source'
    );
    
    const facets = new RunFacetsBuilder()
      .setExternalQuery(externalQuery)
      .build();
    
    expect(facets.externalQuery).toBe(externalQuery);
  });
  
  it('should create a RunFacets instance with nominal time', () => {
    const nominalTime = new NominalTime(
      'test-producer',
      'http://schema.com',
      '2023-01-01T00:00:00Z',
      '2023-01-01T01:00:00Z'
    );
    
    const facets = new RunFacetsBuilder()
      .setNominalTime(nominalTime)
      .build();
    
    expect(facets.nominalTime).toBe(nominalTime);
  });
  
  it('should create a RunFacets instance with parent', () => {
    const parent = new Parent(
      'test-producer',
      'http://schema.com',
      'test-job',
      'test-namespace',
      'run-123'
    );
    
    const facets = new RunFacetsBuilder()
      .setParent(parent)
      .build();
    
    expect(facets.parent).toBe(parent);
  });
  
  it('should create a RunFacets instance with all facets', () => {
    const errorMessage = new ErrorMessage(
      'test-producer',
      'http://schema.com',
      'Test error message',
      'TypeScript'
    );
    
    const externalQuery = new ExternalQuery(
      'test-producer',
      'http://schema.com',
      'query-123',
      'test-source'
    );
    
    const nominalTime = new NominalTime(
      'test-producer',
      'http://schema.com',
      '2023-01-01T00:00:00Z',
      '2023-01-01T01:00:00Z'
    );
    
    const parent = new Parent(
      'test-producer',
      'http://schema.com',
      'test-job',
      'test-namespace',
      'run-123'
    );
    
    const facets = new RunFacetsBuilder()
      .setErrorMessage(errorMessage)
      .setExternalQuery(externalQuery)
      .setNominalTime(nominalTime)
      .setParent(parent)
      .build();
    
    expect(facets.errorMessage).toBe(errorMessage);
    expect(facets.externalQuery).toBe(externalQuery);
    expect(facets.nominalTime).toBe(nominalTime);
    expect(facets.parent).toBe(parent);
  });
  
  it('should support method chaining', () => {
    const builder = new RunFacetsBuilder();
    
    expect(builder.setErrorMessage(null)).toBe(builder);
    expect(builder.setExternalQuery(null)).toBe(builder);
    expect(builder.setNominalTime(null)).toBe(builder);
    expect(builder.setParent(null)).toBe(builder);
  });
});

describe('ErrorMessage', () => {
  it('should create an ErrorMessage with required fields', () => {
    const errorMessage = new ErrorMessage(
      'test-producer',
      'http://schema.com',
      'Test error message',
      'TypeScript'
    );
    
    expect(errorMessage._producer).toBe('test-producer');
    expect(errorMessage._schemaURL).toBe('http://schema.com');
    expect(errorMessage.message).toBe('Test error message');
    expect(errorMessage.programmingLanguage).toBe('TypeScript');
    expect(errorMessage.stackTrace).toBeNull();
  });
  
  it('should create an ErrorMessage with stack trace', () => {
    const stackTrace = 'Error: Test error\n    at test.ts:10:5';
    const errorMessage = new ErrorMessage(
      'test-producer',
      'http://schema.com',
      'Test error message',
      'TypeScript',
      stackTrace
    );
    
    expect(errorMessage.stackTrace).toBe(stackTrace);
  });
  
  it('should return the correct schema URL', () => {
    const errorMessage = new ErrorMessage(
      'test-producer',
      'http://schema.com',
      'Test error message',
      'TypeScript'
    );
    
    expect(errorMessage.getSchema()).toBe('https://openlineage.io/spec/facets/1-0-0/ErrorMessageRunFacet.json');
  });
});

describe('ExternalQuery', () => {
  it('should create an ExternalQuery with required fields', () => {
    const externalQuery = new ExternalQuery(
      'test-producer',
      'http://schema.com',
      'query-123',
      'test-source'
    );
    
    expect(externalQuery._producer).toBe('test-producer');
    expect(externalQuery._schemaURL).toBe('http://schema.com');
    expect(externalQuery.externalQueryId).toBe('query-123');
    expect(externalQuery.source).toBe('test-source');
  });
  
  it('should return the correct schema URL', () => {
    const externalQuery = new ExternalQuery(
      'test-producer',
      'http://schema.com',
      'query-123',
      'test-source'
    );
    
    expect(externalQuery.getSchema()).toBe('https://openlineage.io/spec/facets/1-0-0/ExternalQueryRunFacet.json');
  });
});

describe('NominalTime', () => {
  it('should create a NominalTime with required fields', () => {
    const nominalTime = new NominalTime(
      'test-producer',
      'http://schema.com',
      '2023-01-01T00:00:00Z',
      '2023-01-01T01:00:00Z'
    );
    
    expect(nominalTime._producer).toBe('test-producer');
    expect(nominalTime._schemaURL).toBe('http://schema.com');
    expect(nominalTime.nominalStartTime).toBe('2023-01-01T00:00:00Z');
    expect(nominalTime.nominalEndTime).toBe('2023-01-01T01:00:00Z');
  });
  
  it('should return the correct schema URL', () => {
    const nominalTime = new NominalTime(
      'test-producer',
      'http://schema.com',
      '2023-01-01T00:00:00Z',
      '2023-01-01T01:00:00Z'
    );
    
    expect(nominalTime.getSchema()).toBe('https://openlineage.io/spec/facets/1-0-0/NominalTimeRunFacet.json');
  });
});

describe('Parent', () => {
  it('should create a Parent with required fields', () => {
    const parent = new Parent(
      'test-producer',
      'http://schema.com',
      'test-job',
      'test-namespace',
      'run-123'
    );
    
    expect(parent._producer).toBe('test-producer');
    expect(parent._schemaURL).toBe('http://schema.com');
    expect(parent.job.name).toBe('test-job');
    expect(parent.job.namespace).toBe('test-namespace');
    expect(parent.run.runId).toBe('run-123');
  });
  
  it('should return the correct schema URL', () => {
    const parent = new Parent(
      'test-producer',
      'http://schema.com',
      'test-job',
      'test-namespace',
      'run-123'
    );
    
    expect(parent.getSchema()).toBe('https://openlineage.io/spec/facets/1-0-0/ParentRunFacet.json');
  });
}); 