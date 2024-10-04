const { removeEmptyFields } = require("../utils/Utils");

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