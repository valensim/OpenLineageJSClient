import fs from "fs";
import yaml from "js-yaml";
import {HttpConfig, HttpTransport, httpTransportFromFile} from "./http";
import {ConsoleTransport} from "./console";
import {Transport} from "./Transport";

/**
 * @returns {Transport | null}
 */
function getTransportFromFile() {
  //TODO: add validation and rename to openlineage.yaml to match the spec
  const fileContents = fs.readFileSync('openlineage.yaml', 'utf8');

  /** @type {import("../types").YamlConfig} */
  const config = yaml.load(fileContents);
  if (!config.transport) {
	throw new Error("No transport configuration found in config.yaml");
  }
  switch (config.transport.type) {
	case "http":
	  return httpTransportFromFile(config.transport);
	case "console":
	  return new ConsoleTransport();
	default:
	  throw new Error(config.transport.type + " is not a valid transport type");
  }
}

export {getTransportFromFile};

