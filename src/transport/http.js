const BaseEvent = require("../events/BaseEvent");
const {Transport, Config} = require("./Transport");
const axios = require('axios');
const {EventType} = require("../types");


class HttpConfig extends Config {
  /**
   * @param {string} url
   * @param {object} options
   */
  constructor(url, options = {}) {
	super();
	this.url = url;
	this.options = {
	  method: 'post',
	  headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	  },
	  ...options,
	};
  }

  fromFile() {
	throw new Error("Config.fromFile must be overridden");
  }
}

class HttpTransport extends Transport {
  /**
   * @param {HttpConfig} config
   */
  constructor(config) {
	super();
	this.url = config.url;
	this.options = config.options;
  }

  getConfig(event) {
	event['eventType'] = EventType.START;
	let data = JSON.stringify(event);
	return {
	  ...this.options,
	  url: this.url,
	  data: data,
	};
  }

  /**
   * @param {BaseEvent} event
   * @returns {Promise<any>}
   */
  async emit(event) {
	event['eventType'] = EventType.START;
	let data = JSON.stringify(event);
	let config = {
	  ...this.options,
	  url: this.url,
	  data: data,
	};
	try {
	  const response = await axios(config)
	  console.log(response.data);
	  return response.data;
	}
	catch (error) {
	 console.log(error);
	 return error;
	}
  }
}

module.exports = {HttpTransport, HttpConfig};