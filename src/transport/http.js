import validator from "validator";
import {BaseEvent} from "../events/base-event";
import {Transport} from "./transport";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class HttpConfig {
  /**
   * @param {string} url
   * @param {object} options
   * @param {string | null} token
   */
  constructor(url, options = {}, token = null) {
	validateUrlAndToken(url, token);
	this.url = url;
	this.options = {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		...(token && {'Authorization': `Bearer ${token}`})
	  },
	  ...options,
	};
  }
}

/**
 * @param {string} url
 * @param {string | null} token
 */
function validateUrlAndToken(url, token = null) {
  if (!validator.isURL(url, {require_host: false, require_tld: false})) {
	throw new Error("Invalid URL");
  }
  if (token && !validator.isJWT(token)) {
	throw new Error("Invalid token");
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

  /**
   * @param {Object} data
   * @returns {*&{data, url}}
   */
  getRequest(data) {
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
	let data = JSON.stringify(event);
	let config = {
	  ...this.options,
	  url: this.url,
	  data: data,
	};
	const response = await axios(config)
	if (process.env.DEBUG === 'true') {
	  console.debug(response)
	}
	return response;
  }

  /**
   * @param {import("../types").TransportConfig} config
   * @returns {HttpTransport}
   */
  static fromFile(config) {
	if (!config.url) {
	  throw new Error("Missing URL in config");
	}
	return new HttpTransport(
		new HttpConfig(config.url, config.options, config.token)
	);
  }
}

export {HttpTransport, HttpConfig};