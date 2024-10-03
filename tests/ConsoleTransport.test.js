const {ConsoleTransport} = require('../src/transport/console');
const {BaseEvent} = require('../src/events/BaseEvent');
const {RunEventBuilder} = require("../src/events/RunEvent");
const {EventType} = require("../src/types");
const {getDummyRunEvent} = require("../src/utils/DummyEvent");

describe ('ConsoleTransport', () => {
  it('should emit an event to the console', async () => {

	const producer = 'https://example.com/producer';
	const schemaURL = 'https://example.com/schema';

	const event = getDummyRunEvent();
	const consoleTransport = new ConsoleTransport();
	consoleTransport.emit(event);
  });
});