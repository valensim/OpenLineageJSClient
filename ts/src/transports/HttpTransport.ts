import validator from 'validator';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { BaseEvent } from '../events/BaseEvent.js';
import { Transport } from './TransportInterface.js';
import { TransportConfig } from './Factory.js';

dotenv.config();

/**
 * Configuration for HTTP transport.
 */
export class HttpConfig {
  url: string;
  options: AxiosRequestConfig;
  token: string | null;

  /**
   * Constructs an HttpConfig instance.
   * @param url - The URL for the HTTP transport.
   * @param options - Additional Axios request options.
   * @param token - Optional authorization token.
   */
  constructor(
    url: string,
    options: AxiosRequestConfig = {},
    token: string | null = null,
  ) {
    validateUrlAndToken(url, token);
    this.url = url;
    this.token = token;
    this.options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
  }
}

/**
 * Validates the URL and token.
 * @param url - The URL to validate.
 * @param token - The token to validate (optional).
 * @throws {Error} If the URL or token is invalid.
 */
function validateUrlAndToken(url: string, token: string | null = null): void {
  if (!validator.isURL(url, { require_host: false, require_tld: false })) {
    throw new Error('Invalid URL');
  }
  if (token && !validator.isJWT(token)) {
    throw new Error('Invalid token');
  }
}

/**
 * HTTP transport implementation for emitting events.
 */
export class HttpTransport implements Transport {
  private url: string;
  private options: AxiosRequestConfig;

  /**
   * Constructs an HttpTransport instance.
   * @param config - The HTTP configuration.
   */
  constructor(config: HttpConfig) {
    this.url = config.url;
    this.options = config.options;
  }

  /**
   * Emits an event to the configured HTTP endpoint.
   * @param event - The event to emit.
   * @returns A promise that resolves with the Axios response.
   */
  async emit<T = AxiosResponse<any, any>>(event: BaseEvent): Promise<T> {
    const data = JSON.stringify(event);
    const config: AxiosRequestConfig = {
      ...this.options,
      url: this.url,
      data,
    };

    const response = await axios(config);

    if (process.env.DEBUG === 'true') {
      console.debug(response);
    }
    return response as T;
  }

  /**
   * Creates an HttpTransport instance from a configuration object.
   * @param config - The transport configuration.
   * @returns A new HttpTransport instance.
   * @throws {Error} If the configuration is invalid.
   */
  static fromFile(config: TransportConfig): HttpTransport {
    if (!config.url) {
      throw new Error('Missing URL in config');
    }
    return new HttpTransport(
      new HttpConfig(config.url, config.options || {}, config.token || null),
    );
  }
}
