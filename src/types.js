// @ts-nocheck
// src/types.js

import {Dataset} from "./dataset";

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
 * @typedef {Object} TransportConfig
 * @property {string} type
 * @property {string} url
 * @property {object} options
 * @property {string | null} token
 */

/**
 * @typedef {Object} ClientConfig
 * @property {TransportConfig} transport
 */



export {EventType, TransformationType, FieldTransformationType};
