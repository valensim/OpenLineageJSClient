const {getDummyRunEvent} = require("./DummyEvent");
const {ConsoleTransport} = require("../src/transport/console");
const {OpenLineageClient} = require("../src/client");
describe('DefaultScenario', () => {
  it('Creates client sets up a transport and transports an event', async () => {

	const producer = 'https://example.com/producer';

	const event = getDummyRunEvent();
	const client = new OpenLineageClient(producer, new ConsoleTransport());

	const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
	});

	client.emit(event);

	expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(event, null, 2));

	consoleSpy.mockRestore();
  });
});