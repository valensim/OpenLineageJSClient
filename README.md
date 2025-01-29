# Open Lineage Client for Javascript
Recently the whole project was converted to typescript but the functionality remains exactly the same.

## Overview
This project is supposed to offer a similar functionality as the Python and Java Open Lineage [Clients](https://github.com/OpenLineage/OpenLineage/tree/main/client) so creation and transportation of the OL events.

## Features
- [x] Event creation and serialization
- [x] ConsoleTransport
- [x] HTTPTransport
- [x] File Config
- [x] CI - only on gitlab

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
const client = new OpenLineageClient(new ConsoleTransport());
client.emit(event);
``` 

### HTTPTransport
- create a new instance of the LineageClient with the HTTP transport
- pass your event to the `emit` method of the client
```javascript
const transport = new HttpTransport(new HttpConfig("http://localhost:5000/api/v1/lineage"));
const client = new OpenLineageClient(transport);
client.emit(event);
```

### File Config
- create a new config yaml file named 'openlineage.yaml' in root of the project
- example of simple http transport config
```yaml
transport:
  type: http
  config:
    url: http://localhost:5000/api/v1/lineage 
```
- create a new instance of the LineageClient without providing the transport it will be automatically loaded from the file if file is present
```javascript
    const client = new OpenLineageClient();
    client.emit(event);
```

### Testing
To run the tests, use the following command: `npm test`
All the tests run via vitest
you can switch between remote and local tests by changing the values in your .env file
MARQUEZ_UP=false
DEBUG=false

