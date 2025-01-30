import { isValidURI } from '../utils/utils.js';

/**
 * Base class for all events.
 */
export class BaseEvent {
  eventTime: string;
  producer: string;
  schemaURL: string;

  constructor(eventTime: string, producer: string, schemaURL: string) {
    if (!isValidURI(schemaURL) || !isValidURI(producer)) {
      throw new Error('Invalid URL');
    }
    this.eventTime = eventTime;
    this.producer = producer;
    this.schemaURL = schemaURL;
  }

  getSchema(): string {
    return 'https://openlineage.io/spec/2-0-2/OpenLineage.json';
  }
}
