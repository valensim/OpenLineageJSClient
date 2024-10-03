const {getDummyRunEvent} = require("../src/utils/DummyEvent");
const {ConsoleTransport} = require("../src/transport/console");
const {OpenLineageClient} = require("../src/client");
describe ('DefaultScenario', () => {
  it('Creates client sets up a transport and transports an event', async () => {

	const producer = 'https://example.com/producer';
	const schemaURL = 'https://example.com/schema';

	const event = getDummyRunEvent();
	const client = new OpenLineageClient(producer, new ConsoleTransport());
	client.emit(event);
  });
});