import fs from "fs";
import yaml from "js-yaml";
import {HttpTransport} from "./http.js";
import {ConsoleTransport} from "./console.js";
import {Transport} from "./transport.js";

/**
 * Loads and parses the YAML file, returning a ClientConfig object.
 * @returns {import("../types").ClientConfig}
 */
function loadClientConfig() {
  const fileContents = fs.readFileSync('openlineage.yaml', 'utf8');
  return /** @type {import("../types").ClientConfig} */ (yaml.load(fileContents));
}

/**
 * @returns {Transport | null}
 */
function getTransportFromFile() {
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
	  throw new Error(config.transport.type + " is not a valid transport type");
  }
}

export {getTransportFromFile};