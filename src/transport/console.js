import {BaseEvent} from "../events/BaseEvent";
import {Transport} from "./Transport";

class ConsoleTransport extends Transport {
  constructor() {
	super();
  }

  /**
   * @param {BaseEvent} event
   */
  async emit(event) {
	console.log(JSON.stringify(event, null, 2));
  }
}

export {ConsoleTransport};