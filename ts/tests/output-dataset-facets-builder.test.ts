import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  OutputDatasetFacetsBuilder,
  OutputStatisticsBuilder
} from '../src/builders/OutputDatasetFacetsBuilder.js';
import { OutputDatasetFacets } from '../src/facets/OutputDatasetFacets.js';

// Mock the isValidURI function
vi.mock('../src/utils/utils.js', () => ({
  isValidURI: vi.fn().mockReturnValue(true)
}));

describe('OutputDatasetFacetsBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an OutputDatasetFacets instance with default values', () => {
    const facets = new OutputDatasetFacetsBuilder().build();
    
    expect(facets).toBeInstanceOf(OutputDatasetFacets);
    expect(facets.outputStatistics).toBeNull();
  });
  
  it('should create an OutputDatasetFacets instance with output statistics', () => {
    const outputStatistics = new OutputStatisticsBuilder('test-producer', 'http://schema.com').build();
    
    const facets = new OutputDatasetFacetsBuilder()
      .setOutputStatistics(outputStatistics)
      .build();
    
    expect(facets).toBeInstanceOf(OutputDatasetFacets);
    expect(facets.outputStatistics).toBe(outputStatistics);
  });
  
  it('should support method chaining', () => {
    const builder = new OutputDatasetFacetsBuilder();
    const outputStatistics = new OutputStatisticsBuilder('test-producer', 'http://schema.com').build();
    
    expect(builder.setOutputStatistics(outputStatistics)).toBe(builder);
  });
});

describe('OutputStatisticsBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an OutputStatistics instance with default values', () => {
    const statistics = new OutputStatisticsBuilder('test-producer', 'http://schema.com').build();
    
    expect(statistics._producer).toBe('test-producer');
    expect(statistics._schemaURL).toBe('http://schema.com');
    expect(statistics.rowCount).toBe(0);
    expect(statistics.fileCount).toBe(0);
    expect(statistics.size).toBe(0);
  });
  
  it('should create an OutputStatistics instance with all values', () => {
    const statistics = new OutputStatisticsBuilder('test-producer', 'http://schema.com')
      .setRowCount(100)
      .setFileCount(5)
      .setSize(1024)
      .build();
    
    expect(statistics._producer).toBe('test-producer');
    expect(statistics._schemaURL).toBe('http://schema.com');
    expect(statistics.rowCount).toBe(100);
    expect(statistics.fileCount).toBe(5);
    expect(statistics.size).toBe(1024);
  });
  
  it('should support method chaining', () => {
    const builder = new OutputStatisticsBuilder('test-producer', 'http://schema.com');
    
    expect(builder.setRowCount(100)).toBe(builder);
    expect(builder.setFileCount(5)).toBe(builder);
    expect(builder.setSize(1024)).toBe(builder);
  });
}); 