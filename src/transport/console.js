import {BaseEvent} from "../events/base-event";
import {Transport} from "./transport";

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