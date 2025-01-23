export type URI = string; // For producer and schemaURL
export type UUID = string; // For runId
// export type FieldTransformationType = 'IDENTITY' | 'MASKED';
export enum FieldTransformationType {
  IDENTITY = 'IDENTITY',
  MASKED = 'MASKED'
}
// export type TransformationType = 'DIRECT' | 'INDIRECT';
export enum TransformationType {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT'
}
// export type ProcessingType = 'BATCH' | 'STREAMING';
export enum ProcessingType {
  BATCH = 'BATCH',
  STREAMING = 'STREAMING'
}