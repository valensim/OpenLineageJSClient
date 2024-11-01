import fs from "fs";
import yaml from "js-yaml";
import {HttpConfig, HttpTransport} from "./http";
import {ConsoleTransport} from "./console";
import {Transport} from "./Transport";

/**
 * @returns {Transport | null}
 */
function getTransportFromFile() {
  try {
	//TODO: add validation and rename to openlineage.yaml to match the spec
	const fileContents = fs.readFileSync('config.yaml', 'utf8');

	/** @type {import("../types").YamlConfig} */
	const config = yaml.load(fileContents);
	console.log(config);
	switch (config.transport.type) {
	  case "http":
		return new HttpTransport(new HttpConfig(config.transport.url));
	  case "console":
		return new ConsoleTransport();
	  default:
		throw new Error("Invalid transport type");
	}
  } catch (e) {
	console.log(e);
	return null;
  }
}

export {getTransportFromFile};

