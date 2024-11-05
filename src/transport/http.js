import validator from "validator";
import {BaseEvent} from "../events/BaseEvent";
import {Transport, Config} from "./Transport";
import axios from 'axios';

class HttpConfig extends Config {
  /**
   * @param {string} url
   * @param {object} options
   * @param {string | null} token
   */
  constructor(url, options = {}, token = null) {
	super();
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

/**
 * @returns {HttpTransport}
 */
function httpTransportFromFile(config) {
  if (!config.url) {
	throw new Error("Missing URL in config");
  }
  validateUrlAndToken(config.url, config.token);
  //what really are available options? -> turns out there can be a lot of shit soo probably no reason to try to check for all of it
  return new HttpTransport(
	  new HttpConfig(config.url, config.options, config.token));
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
	try {
	  const response = await axios(config)
	  console.debug(response)
	  return response.data;
	} catch (error) {
	  console.error(error);
	  return error;
	}
  }
}

export {HttpTransport, HttpConfig, httpTransportFromFile};