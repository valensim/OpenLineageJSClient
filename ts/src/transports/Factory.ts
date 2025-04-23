import fs from 'fs';
import yaml from 'js-yaml';
import { HttpTransport } from './HttpTransport.js';
import { ConsoleTransport } from './ConsoleTransport.js';
import { Transport } from './TransportInterface.js';

/**
 * Configuration specific to a transport type, typically loaded from `openlineage.yaml`.
 */
export interface TransportConfig {
  /** The type of transport (e.g., 'http', 'console'). */
  type: string;
  /** The target URL (primarily for HTTP transport). */
  url?: string; // Marked optional as not needed for ConsoleTransport
  /** Transport-specific options (e.g., AxiosRequestConfig for HTTP). */
  options?: Record<string, unknown>; // Generic options object
  /** Authentication token (primarily for HTTP transport). */
  token?: string | null;
}

/**
 * Represents the overall client configuration structure loaded from `openlineage.yaml`.
 */
export interface ClientConfig {
  /** The configuration for the desired transport. */
  transport: TransportConfig;
}

/**
 * Loads and parses the YAML file, returning a ClientConfig object.
 */
function loadClientConfig(): ClientConfig {
  const fileContents = fs.readFileSync('openlineage.yaml', 'utf8');
  return yaml.load(fileContents) as ClientConfig;
}

/**
 * Attempts to load transport configuration from `openlineage.yaml` in the current working directory
 * and returns the corresponding Transport instance.
 *
 * @returns {Transport | null} The configured Transport instance, or null if the file cannot be read or parsed (errors are logged).
 * @throws {Error} If the configuration is invalid (e.g., missing transport section, invalid type).
 */
function getTransportFromFile(): Transport | null {
  try {
    const config = loadClientConfig();
    if (!config.transport) {
      throw new Error('No transport configuration found in openlineage.yaml');
    }

    switch (config.transport.type) {
      case 'http':
        // Ensure HttpTransport.fromFile handles potential missing fields in config.transport gracefully
        return HttpTransport.fromFile(config.transport);
      case 'console':
        return new ConsoleTransport();
      default:
        console.error(`${config.transport.type} is not a valid transport type in openlineage.yaml`);
        return null; // Return null for invalid type instead of throwing?
        // throw new Error(`${config.transport.type} is not a valid transport type`);
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File not found - this is acceptable, client will default to ConsoleTransport
      console.info('openlineage.yaml not found, client may default to ConsoleTransport.');
    } else {
      // Log other errors (parsing, invalid config) but don't crash the application
      console.error('Error loading transport configuration from openlineage.yaml:', error);
    }
    return null; // Return null on error to allow defaulting
  }
}

export { getTransportFromFile };
