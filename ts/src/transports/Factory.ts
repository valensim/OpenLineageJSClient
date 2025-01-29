import fs from "fs";
import yaml from "js-yaml";
import { HttpTransport } from "./HttpTransport.js";
import { ConsoleTransport } from "./ConsoleTransport.js";
import { Transport } from "./TransportInterface.js";

export interface TransportConfig {
  type: string;
  url: string;
  options: object;
  token: string | null;
}

export interface ClientConfig {
  transport: TransportConfig;
}


/**
 * Loads and parses the YAML file, returning a ClientConfig object.
 */
function loadClientConfig(): ClientConfig {
  const fileContents = fs.readFileSync("openlineage.yaml", "utf8");
  return yaml.load(fileContents) as ClientConfig;
}

/**
 * Retrieves the appropriate transport based on the configuration file.
 */
function getTransportFromFile(): Transport | null {
  const config = loadClientConfig();
  if (!config.transport) {
    throw new Error("No transport configuration found in openlineage.yaml");
  }

  switch (config.transport.type) {
    case "http":
      return HttpTransport.fromFile(config.transport);
    case "console":
      return new ConsoleTransport();
    default:
      throw new Error(`${config.transport.type} is not a valid transport type`);
  }
}

export { getTransportFromFile };