import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenLineageClient } from '../src/OpenLineageClient.js';
import { ConsoleTransport } from '../src/transports/ConsoleTransport.js';
import { Transport } from '../src/transports/TransportInterface.js';
import { BaseEvent } from '../src/events/BaseEvent.js';
import * as Factory from '../src/transports/Factory.js';

// Mock the getTransportFromFile function
vi.mock('../src/transports/Factory.js', () => ({
  getTransportFromFile: vi.fn()
}));

// Create a mock event for testing
class MockEvent extends BaseEvent {
  constructor() {
    super(new Date().toISOString(), 'http://test-producer.com', 'http://test-schema.com');
  }
}

// Create a mock transport for testing
class MockTransport implements Transport {
  public emitCalled = false;
  public lastEvent: BaseEvent | null = null;

  async emit<T>(event: BaseEvent): Promise<T> {
    this.emitCalled = true;
    this.lastEvent = event;
    return { success: true } as unknown as T;
  }
}

describe('OpenLineageClient', () => {
  let mockTransport: MockTransport;
  let mockEvent: MockEvent;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockTransport = new MockTransport();
    mockEvent = new MockEvent();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should use the provided transport if one is given', () => {
      const client = new OpenLineageClient(mockTransport);
      expect(client.transport).toBe(mockTransport);
      expect(Factory.getTransportFromFile).not.toHaveBeenCalled();
    });

    it('should try to get a transport from file if none is provided', () => {
      vi.mocked(Factory.getTransportFromFile).mockReturnValue(mockTransport);
      
      const client = new OpenLineageClient();
      
      expect(Factory.getTransportFromFile).toHaveBeenCalledTimes(1);
      expect(client.transport).toBe(mockTransport);
    });

    it('should default to console transport if no transport is provided and none can be loaded from file', () => {
      vi.mocked(Factory.getTransportFromFile).mockReturnValue(null);
      
      const client = new OpenLineageClient();
      
      expect(Factory.getTransportFromFile).toHaveBeenCalledTimes(1);
      expect(client.transport).toBeInstanceOf(ConsoleTransport);
      expect(consoleLogSpy).toHaveBeenCalledWith('No transport provided, defaulting to console transport');
    });
  });

  describe('emit', () => {
    it('should emit an event using the configured transport', async () => {
      const client = new OpenLineageClient(mockTransport);
      
      const result = await client.emit(mockEvent);
      
      expect(mockTransport.emitCalled).toBe(true);
      expect(mockTransport.lastEvent).toBe(mockEvent);
      expect(result).toEqual({ success: true });
    });

    it('should default to console transport if transport is null when emitting', async () => {
      // First create a client with null transport
      const client = new OpenLineageClient();
      
      // Then set the transport to null manually
      client.transport = null;
      
      // Reset the console.log spy to check if it's called during emit
      consoleLogSpy.mockReset();
      
      // Mock the ConsoleTransport.emit method to avoid actual console logging of the event
      const consoleTransportEmitSpy = vi.spyOn(ConsoleTransport.prototype, 'emit')
        .mockImplementation(async () => Promise.resolve({ success: true }));
      
      await client.emit(mockEvent);
      
      expect(client.transport).toBeInstanceOf(ConsoleTransport);
      expect(consoleLogSpy).toHaveBeenCalledWith('No transport provided, defaulting to console transport');
      expect(consoleTransportEmitSpy).toHaveBeenCalledTimes(1);
      
      // Clean up the additional spy
      consoleTransportEmitSpy.mockRestore();
    });

    it('should propagate errors from the transport', async () => {
      const errorTransport: Transport = {
        emit: vi.fn().mockRejectedValue(new Error('Transport error'))
      };
      
      const client = new OpenLineageClient(errorTransport);
      
      await expect(client.emit(mockEvent)).rejects.toThrow('Transport error');
    });
  });
}); 