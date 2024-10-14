# Project Name

## Overview
This project is supposed to offer a similar functionality as the Python and Java Open Lineage Clients so creation and transportation of the OL events.

## Features
- [x] Event creation and serialization
- [x] ConsoleTransport
- [ ] HTTPTransport

## Installation
To install the project dependencies, run:  `npm install`

## Usage
### Event Creation
- create a new instance of the LineageEvent (`Run`, `Job`, `Dataset`) using the provided Builder classes for the event itself and its `Facets`
```javascript
const event = new RunEventBuilder(new Date().toISOString(), producer,
   schemaURL, EventType.START)
  .setRun(run)
  .setJob(job)
  .setInputs([inputDataset])
  .setOutputs([outputDataset])
  .build();
```
### ConsoleTransport
- create a new instance of the LineageClient it will have the console transport by default
- pass your event to the `emit` method of the client
```javascript
const client = new OpenLineageClient(producer, new ConsoleTransport());
client.emit(event);
``` 

### Testing
To run the tests, use the following command: `npm test`

