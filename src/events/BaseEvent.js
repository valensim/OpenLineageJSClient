const validator = require("validator");

/**
 * @class
 */
class BaseEvent{
  /**
   *
   * @param {string} eventTime
   * @param {string} producer
   * @param {string} schemaURL
   */
  constructor(eventTime, producer, schemaURL) {
    if(!validator.isURL(schemaURL) || !validator.isURL(producer)){
      throw new Error('Invalid URL');
    }
    this.eventTime = eventTime;
    this.producer = producer;
    this.schemaURL = schemaURL;
  }

    /**
     * @returns {string}
     */
    getSchema() {
      return "https://openlineage.io/spec/2-0-2/OpenLineage.json"
    }
}

module.exports = BaseEvent;