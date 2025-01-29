import {DummyEvent} from "./test-utils/DummyEvent"
import {EventType, DatasetFacetsBuilder, Ownership} from '../src';
import {describe, it, expect} from "vitest";

describe('Event Creation', () => {
  it('should comply with the OpenLineage schema', async () => {

		const dummy = new DummyEvent('kafka://event-creation.com', 'dynamo://test.com');
		let facet = new DatasetFacetsBuilder().setOwnership(new Ownership("kafka://test.com", "https://github.com/MarquezProject/marquez", [])).build()

	const job = dummy.generateNewJob('Event Creation', 'Tests');
	const runEvent = dummy.generateDummyRunEvent(EventType.COMPLETE, job);
	expect(runEvent).toBeDefined();

	const jobEvent = dummy.generateDummyJobEvent("Event Creation", "Tests");
	expect(jobEvent).toBeDefined();

	const datasetEvent = dummy.generateDummyDatasetEvent();
	expect(datasetEvent).toBeDefined();
  });
});
