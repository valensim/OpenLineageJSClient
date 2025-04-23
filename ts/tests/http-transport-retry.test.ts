import { HttpTransport, HttpConfig } from '../src/transports/HttpTransport.js';
import { BaseEvent } from '../src/events/BaseEvent.js';
import nock from 'nock';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Mock the sleep function to speed up tests
vi.mock('../src/transports/HttpTransport.js', async () => {
  const actual = await vi.importActual('../src/transports/HttpTransport.js');
  return {
    ...actual,
    sleep: vi.fn().mockResolvedValue(undefined),
  };
});

// Create a simple event for testing
class TestEvent extends BaseEvent {
  eventType = 'TEST';

  constructor() {
    const eventTime = new Date().toISOString();
    const producer = 'http://test-producer.com';
    const schemaURL = 'http://test-schema.com';
    super(eventTime, producer, schemaURL);
  }

  toJSON() {
    return {
      eventType: this.eventType,
      eventTime: this.eventTime,
      producer: this.producer,
      schemaURL: this.schemaURL
    };
  }
}

describe('HttpTransport Retry Logic', () => {
  const testUrl = 'http://test-api.com';
  const testEvent = new TestEvent();
  // This is a valid JWT token format for testing purposes
  const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  beforeEach(() => {
    // Clear all mocks and nock interceptors before each test
    vi.clearAllMocks();
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were used
    expect(nock.isDone()).toBe(true);
  });

  // Increase timeout for all tests in this suite
  vi.setConfig({ testTimeout: 10000 });

  it('should successfully send a request without retries', async () => {
    // Setup nock to intercept the request and return success
    nock(testUrl)
      .post('/')
      .reply(200, { success: true });

    // Create transport with retry config
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000)
    );

    // Send the request
    const response = await transport.emit(testEvent) as AxiosResponse;
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it('should retry on network error and eventually succeed', async () => {
    if (process.env.MARQUEZ_UP === 'true') {
      // Skip test when running against real Marquez
      console.log('Skipping retry test when running against real Marquez');
      return;
    }

    // Setup nock to fail twice and then succeed
    nock(testUrl)
      .post('/')
      .replyWithError('Network error')
      .post('/')
      .replyWithError('Network error')
      .post('/')
      .reply(200, { success: true });

    // Create transport with retry config
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000)
    );

    // Spy on console.debug
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    
    // Set DEBUG environment variable
    process.env.DEBUG = 'true';

    // Send the request
    const response = await transport.emit(testEvent) as AxiosResponse;
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
    
    // Verify debug logs were called
    expect(consoleDebugSpy).toHaveBeenCalledTimes(5); // 2 errors + 2 retries + 1 success
    
    // Reset DEBUG environment variable
    process.env.DEBUG = 'false';
  });

  it('should retry on specific status codes and eventually succeed', async () => {
    if (process.env.MARQUEZ_UP === 'true') {
      // Skip test when running against real Marquez
      console.log('Skipping retry test when running against real Marquez');
      return;
    }

    // Setup nock to return 503 twice and then succeed
    nock(testUrl)
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(200, { success: true });

    // Create transport with retry config
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000, [503])
    );

    // Send the request
    const response = await transport.emit(testEvent) as AxiosResponse;
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it('should not retry on non-retryable status codes', async () => {
    // Setup nock to return 400
    nock(testUrl)
      .post('/')
      .reply(400, { error: 'Bad Request' });

    // Create transport with retry config (only retry on 503)
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000, [503])
    );

    // Send the request and expect it to fail
    await expect(transport.emit(testEvent)).rejects.toThrow();
  });

  it('should give up after max retries', async () => {
    // Setup nock to always return 503
    nock(testUrl)
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(503, { error: 'Service Unavailable' });

    // Create transport with 3 retries
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000, [503])
    );

    // Send the request and expect it to fail after 3 retries
    await expect(transport.emit(testEvent)).rejects.toThrow();
  });

  it('should use exponential backoff for retry delays', async () => {
    // Setup nock to fail twice and then succeed
    nock(testUrl)
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(503, { error: 'Service Unavailable' })
      .post('/')
      .reply(200, { success: true });

    // Create transport with specific retry config
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 100, 1000, [503])
    );

    // Get access to the private calculateRetryDelay method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calculateRetryDelay = vi.spyOn(transport as any, 'calculateRetryDelay');

    // Send the request
    await transport.emit(testEvent);
    
    // Verify calculateRetryDelay was called with correct retry counts
    expect(calculateRetryDelay).toHaveBeenCalledTimes(2);
    expect(calculateRetryDelay).toHaveBeenNthCalledWith(1, 0);
    expect(calculateRetryDelay).toHaveBeenNthCalledWith(2, 1);
  });

  it('should respect maxRetryDelay', async () => {
    // Create transport with small maxRetryDelay
    const transport = new HttpTransport(
      new HttpConfig(testUrl, {}, null, 3, 1000, 1500, [503])
    );

    // Calculate delay for retry 3 (which would be 1000 * 2^3 = 8000ms without cap)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delay = (transport as any).calculateRetryDelay(3);
    
    // Verify the delay is capped at maxRetryDelay
    expect(delay).toBeLessThanOrEqual(1500);
  });

  it('should create transport from config with retry options', () => {
    const config = {
      type: 'http',
      url: testUrl,
      options: {
        retry: {
          maxRetries: 5,
          initialRetryDelay: 200,
          maxRetryDelay: 2000,
          retryStatusCodes: [429, 503]
        }
      },
      token: validJwtToken
    };

    const transport = HttpTransport.fromFile(config);
    
    // Access private properties for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).maxRetries).toBe(5);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).initialRetryDelay).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).maxRetryDelay).toBe(2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).retryStatusCodes).toEqual([429, 503]);
  });

  it('should use default retry options when not specified in config', () => {
    const config = {
      type: 'http',
      url: testUrl,
      options: {},
      token: null
    };

    const transport = HttpTransport.fromFile(config);
    
    // Access private properties for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).maxRetries).toBe(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).initialRetryDelay).toBe(1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).maxRetryDelay).toBe(30000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((transport as any).retryStatusCodes).toEqual([408, 429, 500, 502, 503, 504]);
  });
}); 