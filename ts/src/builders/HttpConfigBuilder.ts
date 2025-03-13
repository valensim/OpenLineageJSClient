import { AxiosRequestConfig } from 'axios';
import { HttpConfig } from '../transports/HttpTransport.js';
import { TransportConfig } from '../transports/Factory.js';

/**
 * Builder for creating HttpConfig instances.
 * Simplifies the creation of HttpConfig objects with many parameters.
 */
export class HttpConfigBuilder {
  private url: string;
  private options: AxiosRequestConfig = {};
  private token: string | null = null;
  private maxRetries: number = 3;
  private initialRetryDelay: number = 1000;
  private maxRetryDelay: number = 30000;
  private retryStatusCodes: number[] = [408, 429, 500, 502, 503, 504];

  /**
   * Creates a new HttpConfigBuilder.
   * @param url - The URL for the HTTP transport (required).
   */
  constructor(url: string) {
    this.url = url;
  }

  /**
   * Sets the Axios request options.
   * @param options - The Axios request options.
   * @returns The builder instance for method chaining.
   */
  setOptions(options: AxiosRequestConfig): this {
    this.options = options;
    return this;
  }

  /**
   * Sets the authorization token.
   * @param token - The authorization token.
   * @returns The builder instance for method chaining.
   */
  setToken(token: string): this {
    this.token = token;
    return this;
  }

  /**
   * Sets the maximum number of retry attempts.
   * @param maxRetries - The maximum number of retry attempts.
   * @returns The builder instance for method chaining.
   */
  setMaxRetries(maxRetries: number): this {
    this.maxRetries = maxRetries;
    return this;
  }

  /**
   * Sets the initial delay in milliseconds before retrying.
   * @param initialRetryDelay - The initial delay in milliseconds.
   * @returns The builder instance for method chaining.
   */
  setInitialRetryDelay(initialRetryDelay: number): this {
    this.initialRetryDelay = initialRetryDelay;
    return this;
  }

  /**
   * Sets the maximum delay in milliseconds between retries.
   * @param maxRetryDelay - The maximum delay in milliseconds.
   * @returns The builder instance for method chaining.
   */
  setMaxRetryDelay(maxRetryDelay: number): this {
    this.maxRetryDelay = maxRetryDelay;
    return this;
  }

  /**
   * Sets the HTTP status codes that should trigger a retry.
   * @param retryStatusCodes - The HTTP status codes that should trigger a retry.
   * @returns The builder instance for method chaining.
   */
  setRetryStatusCodes(retryStatusCodes: number[]): this {
    this.retryStatusCodes = retryStatusCodes;
    return this;
  }

  /**
   * Builds and returns a new HttpConfig instance with the configured parameters.
   * @returns A new HttpConfig instance.
   */
  build(): HttpConfig {
    return new HttpConfig(
      this.url,
      this.options,
      this.token,
      this.maxRetries,
      this.initialRetryDelay,
      this.maxRetryDelay,
      this.retryStatusCodes
    );
  }

  /**
   * Creates an HttpConfig instance from a configuration object.
   * @param config - The transport configuration.
   * @returns A new HttpConfig instance.
   * @throws {Error} If the configuration is invalid.
   */
  static fromConfig(config: TransportConfig): HttpConfig {
    if (!config.url) {
      throw new Error('Missing URL in config');
    }
    
    const builder = new HttpConfigBuilder(config.url);
    
    if (config.options) {
      builder.setOptions(config.options);
    }
    
    if (config.token) {
      builder.setToken(config.token);
    }
    
    // Extract retry configuration if present
    interface RetryOptions {
      maxRetries?: number;
      initialRetryDelay?: number;
      maxRetryDelay?: number;
      retryStatusCodes?: number[];
    }
    
    const retryOptions = ((config.options as Record<string, unknown>)?.retry || {}) as RetryOptions;
    
    if (retryOptions.maxRetries !== undefined) {
      builder.setMaxRetries(retryOptions.maxRetries);
    }
    
    if (retryOptions.initialRetryDelay !== undefined) {
      builder.setInitialRetryDelay(retryOptions.initialRetryDelay);
    }
    
    if (retryOptions.maxRetryDelay !== undefined) {
      builder.setMaxRetryDelay(retryOptions.maxRetryDelay);
    }
    
    if (retryOptions.retryStatusCodes) {
      builder.setRetryStatusCodes(retryOptions.retryStatusCodes);
    }
    
    return builder.build();
  }
} 