import {BaseEvent} from "../events/BaseEvent";
import {Transport, Config} from "./Transport";
import axios from 'axios';

class HttpConfig extends Config {
  /**
   * @param {string} url
   * @param {object} options
   * @param {string | null} token
   */
  //TODO: maybe just maybe the token should be a part of the options object
  constructor(url, options = {}, token = null) {
	super();
	this.url = url;
	this.options = {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		...(token && { 'Authorization': `Bearer ${token}` })
	  },
	  ...options,
	};
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

export {HttpTransport, HttpConfig};