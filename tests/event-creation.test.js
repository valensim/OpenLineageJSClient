import {generateDummyRunEvent, generateDummyJobEvent, generateDummyDatasetEvent, generateNewJob} from "./dummy-event"
import {EventType} from "../src/types";
import {describe, it, expect} from "vitest";

describe('Event Creation', () => {
  it('should comply with the OpenLineage schema', async () => {

	const job = generateNewJob('Event Creation', 'Tests');
	const runEvent = generateDummyRunEvent(EventType.COMPLETE, job);
	expect(runEvent).toBeDefined();

	const jobEvent = generateDummyJobEvent("Event Creation", "Tests");
	expect(jobEvent).toBeDefined();

	const datasetEvent = generateDummyDatasetEvent();
	expect(datasetEvent).toBeDefined();
  });
});
