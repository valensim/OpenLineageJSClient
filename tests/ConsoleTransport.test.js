const {ConsoleTransport} = require('../src/transport/console');
const {BaseEvent} = require('../src/events/BaseEvent');
const {RunEventBuilder} = require("../src/events/RunEvent");
const {EventType} = require("../src/types");
const {getDummyRunEvent} = require("./DummyEvent");

describe('ConsoleTransport', () => {
  it('should emit an event to the console', async () => {

	const event = getDummyRunEvent();
	const consoleTransport = new ConsoleTransport();

	const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
	});

	consoleTransport.emit(event);

	expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

	consoleSpy.mockRestore();
  });
});