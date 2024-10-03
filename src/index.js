// src/index.js

import OpenLineageClient from './client';

/**
 * @type {import('./types').LineageEvent}
 */
const exampleEvent = {
  eventType: 'START',
  eventTime: new Date().toISOString(),
  inputs: [],
  outputs: [],
};

const client = new OpenLineageClient('http://openlineage-server');
client.sendEvent(exampleEvent);
