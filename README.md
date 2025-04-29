# OpenLineage Client for TypeScript/JavaScript

This library provides a client for creating and sending OpenLineage events from TypeScript and JavaScript applications. It aims to offer functionality similar to the official OpenLineage [Python](https://github.com/OpenLineage/OpenLineage/tree/main/client/python) and [Java](https://github.com/OpenLineage/OpenLineage/tree/main/client/java) clients.

The project was recently converted to TypeScript, providing enhanced type safety and developer experience, while maintaining the core functionality.

## Overview

OpenLineage is an open standard for data lineage collection and analysis. This client helps instrument your data processing jobs (e.g., ETL/ELT pipelines, data transformations) to emit lineage events according to the OpenLineage specification.

**Key Features:**

*   **Type-Safe:** Written in TypeScript for robust integration.
*   **Event Builders:** Fluent builders for constructing `Run`, `Job`, and `Dataset` information, including standard `Facets`.
*   **Pluggable Transports:** Supports different methods for sending events:
    *   `ConsoleTransport`: Prints events to the console (useful for debugging).
    *   `HttpTransport`: Sends events to an OpenLineage-compatible HTTP endpoint (like Marquez).
*   **Configuration:** Flexible configuration options via YAML file or direct instantiation.
*   **Standard Compliance:** Adheres to the OpenLineage [specification](https://openlineage.io/docs/).

## Prerequisites

*   **Node.js:** Version 18 or higher is recommended. The library is tested with Node.js v22.

## Installation

This package is published on npm ([https://www.npmjs.com/package/open-lineage-client](https://www.npmjs.com/package/open-lineage-client)).

Install the client using npm (prefered method):

```bash
npm install open-lineage-client

```

### Installation from Source

If you want to use the latest code directly from the repository or contribute to development, you can install the dependencies and build the package from the source files:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/valensim/OpenLineageJSClient.git
    cd OpenLineageJSClient/client
    ```

2.  **Navigate to the TypeScript package directory:**
    ```bash
    cd ts
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Build the project:**
    ```bash
    npm run build
    ```

After building, the transpiled JavaScript files will be available in the `ts/dist` directory. You can then potentially use `npm link` within the `ts/` directory to make the local build available globally or within another project, or directly import the built files depending on your needs.

## Usage

Using the client involves three main steps: Initialization, Creating Events, and Sending Events.

### 1. Initialization

First, create an instance of `OpenLineageClient`. You can provide a specific transport or let the client attempt to load configuration from a file.

**Default (File/Console Transport):**

If an `openlineage.yaml` file exists in the project root (where the application is run), the client will attempt to load the configuration from it. If the file is not found or is invalid, it defaults to `ConsoleTransport`.

```typescript
import { OpenLineageClient } from 'open-lineage-client';

const client = new OpenLineageClient();
```

**Explicit Transport (e.g., HTTP):**

You can explicitly configure a transport, such as `HttpTransport`.

```typescript
import { OpenLineageClient } from 'open-lineage-client';
import { HttpTransport, HttpConfig } from 'open-lineage-client';

const httpConfig = new HttpConfig("http://localhost:5000/api/v1/lineage");
const transport = new HttpTransport(httpConfig);
const client = new OpenLineageClient(transport);
```

See the [Configuration](#configuration) section for more details on setting up transports.

### 2. Creating Events

Use the provided builders to construct OpenLineage events. The primary builder is `RunEventBuilder`.

```typescript
import {
  RunEventBuilder,
  JobBuilder,
  RunBuilder,
  DatasetBuilder,
  EventType
} from 'open-lineage-client';
import { v4 as uuidv4 } from 'uuid'; // Example: using uuid for run IDs

// Define Job details
const job = new JobBuilder()
  .setNamespace("my-namespace")
  .setName("my-job")
  .build();

// Define Run details
const run = new RunBuilder()
  .setRunId(uuidv4()) // Generate a unique run ID
  .build();

// Define Input/Output Datasets (optional)
const inputDataset = new DatasetBuilder()
  .setNamespace("my-data-namespace")
  .setName("my-input-table")
  .build();

const outputDataset = new DatasetBuilder()
  .setNamespace("my-data-namespace")
  .setName("my-output-table")
  .build();

// Build the START event
// Use your application/library identifier as producer
const producer = "https://github.com/my-org/my-app/v/1.0.0";
// Specify the OpenLineage schema version you are using
const schemaURL = "https://openlineage.io/spec/1-0-5/OpenLineage.json"; // Use the latest relevant version

const startEvent = new RunEventBuilder()
  .setEventType(EventType.START)
  .setEventTime(new Date().toISOString())
  .setProducer(producer)
  .setSchemaURL(schemaURL)
  .setJob(job)
  .setRun(run)
  .setInputs([inputDataset]) // Optional
  .setOutputs([outputDataset]) // Optional
  .build();

// Later, build the COMPLETE event (or FAIL)
const completeEvent = new RunEventBuilder()
  .setEventType(EventType.COMPLETE) // Or EventType.FAIL
  .setEventTime(new Date().toISOString())
  .setProducer(producer)
  .setSchemaURL(schemaURL)
  .setJob(job)
  .setRun(run)
  .setInputs([inputDataset]) // Usually repeated from START
  .setOutputs([outputDataset]) // Usually repeated from START
  .build();
```

### 3. Sending Events

Use the `emit` method of the client instance to send the constructed events. Note that `emit` returns a Promise.

```typescript
async function sendEvents() {
  // Send the START event
  await client.emit(startEvent);

  // ... your job processing logic ...

  // Send the COMPLETE event
  await client.emit(completeEvent);
}

sendEvents().catch(console.error);
```

## Configuration

The `OpenLineageClient` can be configured in the following ways:

1.  **YAML File (Recommended):** Create a file named `openlineage.yaml` in the root directory from where your application is executed. The client automatically detects and loads this file if no transport is explicitly provided during initialization.
2.  **Direct Instantiation:** Configure and pass a transport instance (`ConsoleTransport` or `HttpTransport`) directly to the `OpenLineageClient` constructor, as shown in the [Initialization](#1-initialization) examples.

### YAML Configuration (`openlineage.yaml`)

The YAML file defines the transport type and its specific configuration.

**Example: Console Transport**

```yaml
transport:
  type: console
# No further config needed for console
```

**Example: HTTP Transport**

```yaml
transport:
  type: http
  config:
    # Required: The URL of the OpenLineage HTTP endpoint
    url: http://localhost:5000/api/v1/lineage

    # Optional: Authentication Token (Bearer)
    # token: Bearer your-api-key

    # Optional: Axios request options (passed directly to Axios)
    options:
      timeout: 5000 # Request timeout in milliseconds (default: depends on Axios)
      headers:
        X-Custom-Header: 'custom-value'
      # Optional: Retry configuration (nested under options)
      retry:
        maxRetries: 5               # Default: 3
        initialRetryDelay: 1000     # Default: 1000 ms
        maxRetryDelay: 30000        # Default: 30000 ms
        # retryStatusCodes: [429, 503] # Optional: Override default retry codes [408, 429, 500, 502, 503, 504]
```

**Supported `transport.type` values:**

*   `http`: Sends events via HTTP POST requests.
*   `console`: Prints events to the standard output.

### Environment Variables

Currently, configuration via environment variables is not directly supported for overriding YAML settings.

## Examples

Here's a more complete example demonstrating sending START and COMPLETE events using configuration loaded from `openlineage.yaml`.

**1. Create `openlineage.yaml`:**

```yaml
# openlineage.yaml
transport:
  type: http
  config:
    url: http://localhost:5000/api/v1/lineage # Replace with your Marquez/OL endpoint
    options:
      timeout: 10000
```

**2. Your Application Code (`myJob.ts`):**

```typescript
import {
  OpenLineageClient,
  RunEventBuilder,
  JobBuilder,
  RunBuilder,
  DatasetBuilder,
  EventType
} from 'open-lineage-client';
import { v4 as uuidv4 } from 'uuid'; // Using uuid library for run IDs

async function runMyJob() {
  // Initialize client - will load from openlineage.yaml if present
  const client = new OpenLineageClient();

  const producer = "https://github.com/my-org/my-app/v/1.0.0";
  const schemaURL = "https://openlineage.io/spec/1-0-5/OpenLineage.json"; // Use latest relevant schema

  const job = new JobBuilder().setNamespace("etl-namespace").setName("daily-report-job").build();
  const run = new RunBuilder().setRunId(uuidv4()).build(); // Generate unique run ID

  const input = new DatasetBuilder().setNamespace("db-schema").setName("source_table").build();
  const output = new DatasetBuilder().setNamespace("db-schema").setName("report_table").build();

  // Create START event
  const startEvent = new RunEventBuilder()
    .setEventType(EventType.START)
    .setEventTime(new Date().toISOString())
    .setProducer(producer)
    .setSchemaURL(schemaURL)
    .setJob(job)
    .setRun(run)
    .setInputs([input])
    .setOutputs([output])
    .build();

  console.log('Sending START event...');
  await client.emit(startEvent); // emit is async

  try {
    // --- Simulate Job Execution ---
    console.log(`Processing data for run ${run.runId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
    console.log('Processing complete.');
    // --- Job Execution End ---

    // Create COMPLETE event
    const completeEvent = new RunEventBuilder()
      .setEventType(EventType.COMPLETE)
      .setEventTime(new Date().toISOString())
      .setProducer(producer)
      .setSchemaURL(schemaURL)
      .setJob(job)
      .setRun(run)
      .setInputs([input])
      .setOutputs([output])
      .build();

    console.log('Sending COMPLETE event...');
    await client.emit(completeEvent);

  } catch (error) {
    console.error('Job failed:', error);
    // Create FAIL event
    const failEvent = new RunEventBuilder()
      .setEventType(EventType.FAIL)
      .setEventTime(new Date().toISOString())
      .setProducer(producer)
      .setSchemaURL(schemaURL)
      .setJob(job)
      .setRun(run)
      // Optionally include error details using facets (e.g., ErrorMessageRunFacet)
      // .addFacet('errorMessage', new ErrorMessageRunFacet(String(error.message), 'TypeScript', error.stack))
      .build();

    console.log('Sending FAIL event...');
    await client.emit(failEvent);
  }
}

runMyJob().catch(console.error);
```

## Development

This section provides guidance for developing and testing the client library itself. If you just want to use the client, see the [Installation](#installation) and [Usage](#usage) sections.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/valensim/OpenLineageJSClient.git
    cd OpenLineageJSClient/ts
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the project:**
    ```bash
    npm run build
    ```

### Running Tests

Tests are written using [Vitest](https://vitest.dev/).

1.  **Navigate to the TypeScript directory:**
    ```bash
    cd ts # If not already there
    ```

2.  **Set up Environment Variables:**
    Ensure a `.env` file exists in the `ts/` directory (one should exist from the clone). This file configures test behaviors:
    ```dotenv
    # ts/.env
    MARQUEZ_UP=false
    DEBUG=false
    ```
    *   `MARQUEZ_UP`: Set to `true` to enable integration tests that require a running instance of a Marquez server (configured via `openlineage.yaml`). Defaults to `false`, skipping these tests.
    *   `DEBUG`: Set to `true` to enable more verbose logging or specific debug behaviors within the tests. Defaults to `false`.

3.  **Run tests:**
    ```bash
    npm test
    ```

    To run tests with coverage reports:
    ```bash
    npm run coverage
    ```

### Building

To transpile the TypeScript code to JavaScript in the `dist` directory:

```bash
# Ensure you are in the ts/ directory
npm run build
```

### Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. Run these from the `ts/` directory.

```bash
# Check formatting
npm run format:check

# Apply formatting
npm run format

# Run linter
npm run lint

# Fix lint errors automatically
npm run lint:fix
```

### Generating Documentation

Technical documentation based on the TSDoc comments in the TypeScript source code can be generated using [TypeDoc](https://typedoc.org/).

1.  **Navigate to the TypeScript directory:**
    ```bash
    cd ts # If not already there
    ```

2.  **Run the generation script (defined in `package.json`):**
    ```bash
    npm run docs
    ```
    This command uses TypeDoc to parse the files in `ts/src`, extracts the documentation comments, and outputs the generated HTML documentation to the `docs/` directory at the project root (`client/docs/`).

    To configure TypeDoc's behavior (e.g., entry points, theme), you can modify the command in `package.json` or use a `typedoc.json` configuration file.

### Contributing

Contributions are welcome! Please feel free to open an issue on the GitHub repository to discuss potential changes or submit a pull request.

## TypeScript Usage

This library is written in TypeScript and includes type definitions (`.d.ts` files) in the distributed package.

*   **TypeScript Projects:** You get full type safety and autocompletion when importing the client.
*   **JavaScript Projects:** You can use this library in plain JavaScript projects as well. While you won't get compile-time type checking, the library is fully functional. Modern editors might still leverage the included type definitions for better IntelliSense.

## CI/CD

Continuous Integration is set up using GitLab CI (see `.gitlab-ci.yml`). (Note: This section might need updates based on current CI setup).

