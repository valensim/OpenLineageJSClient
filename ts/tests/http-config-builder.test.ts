import { HttpConfigBuilder } from '../src/builders/HttpConfigBuilder.js';
import { describe, it, expect } from 'vitest';
import { TransportConfig } from '../src/transports/Factory.js';

describe('HttpConfigBuilder', () => {
  const testUrl = 'http://test-api.com';
  // This is a valid JWT token format for testing purposes
  const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('should create a basic HttpConfig with default values', () => {
    const builder = new HttpConfigBuilder(testUrl);
    const config = builder.build();

    expect(config.url).toBe(testUrl);
    expect(config.token).toBeNull();
    expect(config.maxRetries).toBe(3);
    expect(config.initialRetryDelay).toBe(1000);
    expect(config.maxRetryDelay).toBe(30000);
    expect(config.retryStatusCodes).toEqual([408, 429, 500, 502, 503, 504]);
  });

  it('should allow setting all properties via builder methods', () => {
    const builder = new HttpConfigBuilder(testUrl);
    const config = builder
      .setToken(validJwtToken)
      .setOptions({ timeout: 5000 })
      .setMaxRetries(5)
      .setInitialRetryDelay(500)
      .setMaxRetryDelay(10000)
      .setRetryStatusCodes([429, 503])
      .build();

    expect(config.url).toBe(testUrl);
    expect(config.token).toBe(validJwtToken);
    expect(config.options.timeout).toBe(5000);
    expect(config.maxRetries).toBe(5);
    expect(config.initialRetryDelay).toBe(500);
    expect(config.maxRetryDelay).toBe(10000);
    expect(config.retryStatusCodes).toEqual([429, 503]);
  });

  it('should create HttpConfig from a configuration object', () => {
    const config: TransportConfig = {
      type: 'http',
      url: testUrl,
      token: validJwtToken,
      options: {
        timeout: 5000,
        retry: {
          maxRetries: 5,
          initialRetryDelay: 500,
          maxRetryDelay: 10000,
          retryStatusCodes: [429, 503]
        }
      }
    };

    const httpConfig = HttpConfigBuilder.fromConfig(config);

    expect(httpConfig.url).toBe(testUrl);
    expect(httpConfig.token).toBe(validJwtToken);
    expect(httpConfig.options.timeout).toBe(5000);
    expect(httpConfig.maxRetries).toBe(5);
    expect(httpConfig.initialRetryDelay).toBe(500);
    expect(httpConfig.maxRetryDelay).toBe(10000);
    expect(httpConfig.retryStatusCodes).toEqual([429, 503]);
  });

  it('should use default values when not specified in config', () => {
    const config: TransportConfig = {
      type: 'http',
      url: testUrl,
      options: {},
      token: null
    };

    const httpConfig = HttpConfigBuilder.fromConfig(config);

    expect(httpConfig.url).toBe(testUrl);
    expect(httpConfig.token).toBeNull();
    expect(httpConfig.maxRetries).toBe(3);
    expect(httpConfig.initialRetryDelay).toBe(1000);
    expect(httpConfig.maxRetryDelay).toBe(30000);
    expect(httpConfig.retryStatusCodes).toEqual([408, 429, 500, 502, 503, 504]);
  });

  it('should throw an error when URL is missing', () => {
    // We need to cast to TransportConfig to test the error case
    const config = {} as TransportConfig;
    expect(() => HttpConfigBuilder.fromConfig(config)).toThrow('Missing URL in config');
  });

  it('should support method chaining', () => {
    const builder = new HttpConfigBuilder(testUrl);
    const chainedBuilder = builder.setMaxRetries(5);
    
    expect(chainedBuilder).toBe(builder);
  });
}); 