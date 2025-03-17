import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTransportFromFile } from '../src/transports/Factory.js';
import { ConsoleTransport } from '../src/transports/ConsoleTransport.js';
import fs from 'fs';
import yaml from 'js-yaml';

// Mock modules
vi.mock('fs', async () => {
  return {
    default: {
      readFileSync: vi.fn().mockReturnValue('yaml content')
    },
    readFileSync: vi.fn().mockReturnValue('yaml content')
  };
});

vi.mock('js-yaml', async () => {
  return {
    default: {
      load: vi.fn()
    },
    load: vi.fn()
  };
});

// Mock HttpTransport and HttpConfigBuilder
vi.mock('../src/transports/HttpTransport.js', () => {
  return {
    HttpTransport: {
      fromFile: vi.fn().mockReturnValue({ type: 'MockHttpTransport' })
    }
  };
});

vi.mock('../src/builders/HttpConfigBuilder.js', () => {
  return {
    HttpConfigBuilder: {
      fromConfig: vi.fn().mockReturnValue({})
    }
  };
});

// Define the content constant to ensure consistency
const YAML_CONTENT = 'yaml content';

// No need to import mocked modules again

describe('Transport Factory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return an HttpTransport when config type is http', () => {
    // Mock the file content and yaml parsing
    const mockConfig = {
      transport: {
        type: 'http',
        url: 'http://example.com',
        options: {},
        token: null,
      },
    };
    
    vi.mocked(yaml.load).mockReturnValue(mockConfig);

    const transport = getTransportFromFile();
    
    expect(fs.readFileSync).toHaveBeenCalledWith('openlineage.yaml', 'utf8');
    expect(yaml.load).toHaveBeenCalledWith(YAML_CONTENT);
    expect(transport).toEqual({ type: 'MockHttpTransport' });
  });

  it('should return a ConsoleTransport when config type is console', () => {
    // Mock the file content and yaml parsing
    const mockConfig = {
      transport: {
        type: 'console',
        url: '',
        options: {},
        token: null,
      },
    };
    
    vi.mocked(yaml.load).mockReturnValue(mockConfig);

    const transport = getTransportFromFile();
    
    expect(fs.readFileSync).toHaveBeenCalledWith('openlineage.yaml', 'utf8');
    expect(yaml.load).toHaveBeenCalledWith(YAML_CONTENT);
    expect(transport).toBeInstanceOf(ConsoleTransport);
  });

  it('should throw an error for invalid transport type', () => {
    // Mock the file content and yaml parsing
    const mockConfig = {
      transport: {
        type: 'invalid',
        url: '',
        options: {},
        token: null,
      },
    };
    
    vi.mocked(yaml.load).mockReturnValue(mockConfig);

    expect(() => getTransportFromFile()).toThrow('invalid is not a valid transport type');
  });

  it('should throw an error if no transport configuration is found', () => {
    // Mock the file content and yaml parsing
    const mockConfig = {};
    
    vi.mocked(yaml.load).mockReturnValue(mockConfig);

    expect(() => getTransportFromFile()).toThrow('No transport configuration found in openlineage.yaml');
  });
}); 