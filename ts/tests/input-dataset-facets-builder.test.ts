import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  InputDatasetFacetsBuilder,
  DataQualityMetricsBuilder,
  ColumnMetricsBuilder
} from '../src/builders/InputDatasetFacetsBuilder.js';
import { InputDatasetFacets } from '../src/facets/InputDatasetFacets.js';

// Mock the isValidURI function
vi.mock('../src/utils/utils.js', () => ({
  isValidURI: vi.fn().mockReturnValue(true)
}));

describe('InputDatasetFacetsBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an InputDatasetFacets instance with default values', () => {
    const facets = new InputDatasetFacetsBuilder().build();
    
    expect(facets).toBeInstanceOf(InputDatasetFacets);
    expect(facets.dataQualityMetrics).toBeNull();
  });
  
  it('should create an InputDatasetFacets instance with data quality metrics', () => {
    const dataQualityMetrics = new DataQualityMetricsBuilder('test-producer', 'http://schema.com').build();
    
    const facets = new InputDatasetFacetsBuilder()
      .setDataQualityMetrics(dataQualityMetrics)
      .build();
    
    expect(facets).toBeInstanceOf(InputDatasetFacets);
    expect(facets.dataQualityMetrics).toBe(dataQualityMetrics);
  });
  
  it('should support method chaining', () => {
    const builder = new InputDatasetFacetsBuilder();
    const dataQualityMetrics = new DataQualityMetricsBuilder('test-producer', 'http://schema.com').build();
    
    expect(builder.setDataQualityMetrics(dataQualityMetrics)).toBe(builder);
  });
});

describe('DataQualityMetricsBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a DataQualityMetrics instance with required values', () => {
    const metrics = new DataQualityMetricsBuilder('test-producer', 'http://schema.com').build();
    
    expect(metrics._producer).toBe('test-producer');
    expect(metrics._schemaURL).toBe('http://schema.com');
    expect(metrics.columnMetrics).toEqual({});
    expect(metrics.rowCount).toBeNull();
    expect(metrics.bytes).toBeNull();
    expect(metrics.fileCount).toBeNull();
  });
  
  it('should create a DataQualityMetrics instance with all values', () => {
    const columnMetrics = new ColumnMetricsBuilder().build();
    
    const metrics = new DataQualityMetricsBuilder('test-producer', 'http://schema.com')
      .addColumnMetrics('column1', columnMetrics)
      .setRowCount(100)
      .setBytes(1024)
      .setFileCount(5)
      .build();
    
    expect(metrics._producer).toBe('test-producer');
    expect(metrics._schemaURL).toBe('http://schema.com');
    expect(metrics.columnMetrics).toEqual({ column1: columnMetrics });
    expect(metrics.rowCount).toBe(100);
    expect(metrics.bytes).toBe(1024);
    expect(metrics.fileCount).toBe(5);
  });
  
  it('should support method chaining', () => {
    const builder = new DataQualityMetricsBuilder('test-producer', 'http://schema.com');
    const columnMetrics = new ColumnMetricsBuilder().build();
    
    expect(builder.addColumnMetrics('column1', columnMetrics)).toBe(builder);
    expect(builder.setRowCount(100)).toBe(builder);
    expect(builder.setBytes(1024)).toBe(builder);
    expect(builder.setFileCount(5)).toBe(builder);
  });
});

describe('ColumnMetricsBuilder', () => {
  it('should create a ColumnMetrics instance with default values', () => {
    const metrics = new ColumnMetricsBuilder().build();
    
    expect(metrics.nullCount).toBe(0);
    expect(metrics.distinctCount).toBe(0);
    expect(metrics.sum).toBe(0);
    expect(metrics.count).toBe(0);
    expect(metrics.min).toBe(0);
    expect(metrics.max).toBe(0);
    expect(metrics.quantiles).toEqual({});
  });
  
  it('should create a ColumnMetrics instance with all values', () => {
    const metrics = new ColumnMetricsBuilder()
      .setNullCount(5)
      .setDistinctCount(10)
      .setSum(100)
      .setCount(20)
      .setMin(1)
      .setMax(50)
      .addQuantile('25%', 10)
      .addQuantile('50%', 25)
      .addQuantile('75%', 40)
      .build();
    
    expect(metrics.nullCount).toBe(5);
    expect(metrics.distinctCount).toBe(10);
    expect(metrics.sum).toBe(100);
    expect(metrics.count).toBe(20);
    expect(metrics.min).toBe(1);
    expect(metrics.max).toBe(50);
    expect(metrics.quantiles).toEqual({
      '25%': 10,
      '50%': 25,
      '75%': 40
    });
  });
  
  it('should support method chaining', () => {
    const builder = new ColumnMetricsBuilder();
    
    expect(builder.setNullCount(5)).toBe(builder);
    expect(builder.setDistinctCount(10)).toBe(builder);
    expect(builder.setSum(100)).toBe(builder);
    expect(builder.setCount(20)).toBe(builder);
    expect(builder.setMin(1)).toBe(builder);
    expect(builder.setMax(50)).toBe(builder);
    expect(builder.addQuantile('25%', 10)).toBe(builder);
  });
}); 