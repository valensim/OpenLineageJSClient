/**
 * Represents a Uniform Resource Identifier (URI).
 * Used for identifying producers and schema URLs according to the OpenLineage spec.
 * @example "https://github.com/OpenLineage/OpenLineage/tree/0.0.1/integration/spark"
 */
export type URI = string;

/**
 * Represents a Universally Unique Identifier (UUID).
 * Typically used for run IDs.
 * @example "a7f5f9b5-a6f1-47b8-8a9e-40f4e23c9b7c"
 */
export type UUID = string;

// export type FieldTransformationType = 'IDENTITY' | 'MASKED';
/**
 * Defines the type of transformation applied to a field during lineage.
 */
export enum FieldTransformationType {
  /** Indicates the field's value is passed through without modification. */
  IDENTITY = 'IDENTITY',
  /** Indicates the field's value is masked or obfuscated. */
  MASKED = 'MASKED',
}

// export type TransformationType = 'DIRECT' | 'INDIRECT';
/**
 * Defines the type of transformation relationship between datasets.
 */
export enum TransformationType {
  /** Indicates a direct transformation (e.g., simple SELECT/INSERT). */
  DIRECT = 'DIRECT',
  /** Indicates an indirect transformation (e.g., involving complex logic, joins, aggregations). */
  INDIRECT = 'INDIRECT',
}

// export type ProcessingType = 'BATCH' | 'STREAMING';
/**
 * Defines the processing type of a job run.
 */
export enum ProcessingType {
  /** Indicates a batch processing job. */
  BATCH = 'BATCH',
  /** Indicates a stream processing job. */
  STREAMING = 'STREAMING',
}
