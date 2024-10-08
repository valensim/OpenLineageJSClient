// @ts-nocheck
// src/types.js

const {Dataset} = require("./Datasets");

/**
 * Enum for the event types in OpenLineage.
 * @readonly
 * @enum {string}
 */
const EventType = Object.freeze({
  START: 'START',
  RUNNING: 'RUNNING',
  COMPLETE: 'COMPLETE',
  ABORT: 'ABORT',
  FAIL: 'FAIL',
  OTHER: 'OTHER',
});

/**
 * @readonly
 * @enum {string}
 */
const TransformationType = Object.freeze({
  DIRECT: 'DIRECT',
  INDIRECT: 'INDIRECT',
});

/**
 * @readonly
 * @enum {string}
 */
const FieldTransformationType = Object.freeze({
  IDENTITY: 'IDENTITY',
  MASKED: 'MASKED',
});

/**
 * @typedef {Object} LineageEvent
 * @property {string} eventType
 * @property {string} eventTime
 * @property {Dataset[]} inputs
 * @property {Dataset[]} outputs
 */

module.exports = {EventType, TransformationType, FieldTransformationType};
