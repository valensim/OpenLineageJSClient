const {getDummyRunEvent, getDummyJobEvent, getDummyDatasetEvent} = require("./DummyEvent");

describe('Event Creation', () => {
  it('should comply with the OpenLineage schema', async () => {

	const runEvent = getDummyRunEvent();
	expect(runEvent).toBeDefined();

	const jobEvent = getDummyJobEvent();
	expect(jobEvent).toBeDefined();

	const datasetEvent = getDummyDatasetEvent();
	expect(datasetEvent).toBeDefined();
  });
});
