import { describe, it, expect } from 'vitest';
import { DatasetBuilder } from '../src/builders/DatasetBuilder.js';
import { Dataset } from '../src/entities/Dataset.js';
import { DatasetFacets } from '../src/facets/DatasetFacets.js';

describe('DatasetBuilder', () => {
  describe('build', () => {
    it('should create a Dataset with name and namespace', () => {
      const dataset = new DatasetBuilder()
        .setName('test-dataset')
        .setNamespace('test-namespace')
        .build();
      
      expect(dataset).toBeInstanceOf(Dataset);
      expect(dataset.name).toBe('test-dataset');
      expect(dataset.namespace).toBe('test-namespace');
      expect(dataset.facets).toEqual({});
    });
    
    it('should create a Dataset with facets', () => {
      const facets = new DatasetFacets();
      
      const dataset = new DatasetBuilder()
        .setName('test-dataset')
        .setNamespace('test-namespace')
        .setFacets(facets)
        .build();
      
      expect(dataset).toBeInstanceOf(Dataset);
      expect(dataset.name).toBe('test-dataset');
      expect(dataset.namespace).toBe('test-namespace');
      expect(dataset.facets).toBe(facets);
    });
    
    it('should throw an error if name is missing', () => {
      const builder = new DatasetBuilder()
        .setNamespace('test-namespace');
      
      expect(() => builder.build()).toThrow('Name and Namespace are required');
    });
    
    it('should throw an error if namespace is missing', () => {
      const builder = new DatasetBuilder()
        .setName('test-dataset');
      
      expect(() => builder.build()).toThrow('Name and Namespace are required');
    });
    
    it('should support method chaining', () => {
      const builder = new DatasetBuilder();
      
      expect(builder.setName('test-dataset')).toBe(builder);
      expect(builder.setNamespace('test-namespace')).toBe(builder);
      expect(builder.setFacets(new DatasetFacets())).toBe(builder);
    });
  });
}); 