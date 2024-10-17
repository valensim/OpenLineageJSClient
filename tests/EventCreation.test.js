const {getDummyRunEvent, getDummyJobEvent, getDummyDatasetEvent, generateNewJob} = require("./DummyEvent");
const {EventType} = require("../src/types");

describe('Event Creation', () => {
  it('should comply with the OpenLineage schema', async () => {

	const job = generateNewJob('Event Creation', 'Tests');
	const runEvent = getDummyRunEvent(EventType.COMPLETE, job);
	expect(runEvent).toBeDefined();

	const jobEvent = getDummyJobEvent("Event Creation", "Tests");
	expect(jobEvent).toBeDefined();

	const datasetEvent = getDummyDatasetEvent();
	expect(datasetEvent).toBeDefined();
  });
});
