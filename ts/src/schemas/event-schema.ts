export default {
  type: 'object',
  $id: 'https://openlineage.io/spec/2-0-2/OpenLineage.json',
  $defs: {
    BaseEvent: {
      type: 'object',
      properties: {
        eventTime: {
          description: 'the time the event occurred at',
          type: 'string',
          format: 'date-time',
        },
        producer: {
          description:
            'URI identifying the producer of this metadata. For example this could be a git url with a given tag or sha',
          type: 'string',
          format: 'uri',
          example:
            'https://github.com/OpenLineage/OpenLineage/blob/v1-0-0/client',
        },
        schemaURL: {
          description:
            'The JSON Pointer (https://tools.ietf.org/html/rfc6901) URL to the corresponding version of the schema definition for this RunEvent',
          type: 'string',
          format: 'uri',
          example: 'https://openlineage.io/spec/0-0-1/OpenLineage.json',
        },
      },
      required: ['eventTime', 'producer', 'schemaURL'],
    },
    RunEvent: {
      allOf: [
        { $ref: '#/$defs/BaseEvent' },
        {
          type: 'object',
          properties: {
            eventType: {
              description:
                'the current transition of the run state. It is required to issue 1 START event and 1 of [ COMPLETE, ABORT, FAIL ] event per run. Additional events with OTHER eventType can be added to the same run. For example to send additional metadata after the run is complete',
              type: 'string',
              enum: ['START', 'RUNNING', 'COMPLETE', 'ABORT', 'FAIL', 'OTHER'],
              example: 'START|RUNNING|COMPLETE|ABORT|FAIL|OTHER',
            },
            run: {
              $ref: '#/$defs/Run',
            },
            job: {
              $ref: '#/$defs/Job',
            },
            inputs: {
              description: 'The set of **input** datasets.',
              type: 'array',
              items: {
                $ref: '#/$defs/InputDataset',
              },
            },
            outputs: {
              description: 'The set of **output** datasets.',
              type: 'array',
              items: {
                $ref: '#/$defs/OutputDataset',
              },
            },
          },
          required: ['run', 'job'],
        },
      ],
    },
    DatasetEvent: {
      allOf: [
        { $ref: '#/$defs/BaseEvent' },
        {
          type: 'object',
          properties: {
            dataset: {
              $ref: '#/$defs/StaticDataset',
            },
          },
          required: ['dataset'],
          not: { required: ['job', 'run'] },
        },
      ],
    },
    JobEvent: {
      allOf: [
        { $ref: '#/$defs/BaseEvent' },
        {
          type: 'object',
          properties: {
            job: {
              $ref: '#/$defs/Job',
            },
            inputs: {
              description: 'The set of **input** datasets.',
              type: 'array',
              items: {
                $ref: '#/$defs/InputDataset',
              },
            },
            outputs: {
              description: 'The set of **output** datasets.',
              type: 'array',
              items: {
                $ref: '#/$defs/OutputDataset',
              },
            },
          },
          required: ['job'],
          not: { required: ['run'] },
        },
      ],
    },
    Run: {
      type: 'object',
      properties: {
        runId: {
          description:
            'The globally unique ID of the run associated with the job.',
          type: 'string',
          format: 'uuid',
        },
        facets: {
          description: 'The run facets.',
          type: 'object',
          anyOf: [
            {
              type: 'object',
              additionalProperties: { $ref: '#/$defs/RunFacet' },
            },
          ],
        },
      },
      required: ['runId'],
    },
    RunFacet: {
      description: 'A Run Facet',
      type: 'object',
      allOf: [{ $ref: '#/$defs/BaseFacet' }],
    },
    Job: {
      type: 'object',
      properties: {
        namespace: {
          description: 'The namespace containing that job',
          type: 'string',
          example: 'my-scheduler-namespace',
        },
        name: {
          description: 'The unique name for that job within that namespace',
          type: 'string',
          example: 'myjob.mytask',
        },
        facets: {
          description: 'The job facets.',
          type: 'object',
          anyOf: [
            {
              type: 'object',
              additionalProperties: { $ref: '#/$defs/JobFacet' },
            },
          ],
        },
      },
      required: ['namespace', 'name'],
    },
    JobFacet: {
      description: 'A Job Facet',
      type: 'object',
      allOf: [
        { $ref: '#/$defs/BaseFacet' },
        {
          type: 'object',
          properties: {
            _deleted: {
              description: 'set to true to delete a facet',
              type: 'boolean',
            },
          },
        },
      ],
    },
    InputDataset: {
      description: 'An input dataset',
      type: 'object',
      allOf: [
        { $ref: '#/$defs/Dataset' },
        {
          type: 'object',
          properties: {
            inputFacets: {
              description: 'The input facets for this dataset.',
              type: 'object',
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: {
                    $ref: '#/$defs/InputDatasetFacet',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    InputDatasetFacet: {
      description: 'An Input Dataset Facet',
      type: 'object',
      allOf: [{ $ref: '#/$defs/BaseFacet' }],
    },
    OutputDataset: {
      description: 'An output dataset',
      type: 'object',
      allOf: [
        { $ref: '#/$defs/Dataset' },
        {
          type: 'object',
          properties: {
            outputFacets: {
              description: 'The output facets for this dataset',
              type: 'object',
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: {
                    $ref: '#/$defs/OutputDatasetFacet',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    OutputDatasetFacet: {
      description: 'An Output Dataset Facet',
      type: 'object',
      allOf: [{ $ref: '#/$defs/BaseFacet' }],
    },
    Dataset: {
      type: 'object',
      properties: {
        namespace: {
          description: 'The namespace containing that dataset',
          type: 'string',
          example: 'my-datasource-namespace',
        },
        name: {
          description: 'The unique name for that dataset within that namespace',
          type: 'string',
          example: 'instance.schema.table',
        },
        facets: {
          description: 'The facets for this dataset',
          type: 'object',
          anyOf: [
            {
              type: 'object',
              additionalProperties: { $ref: '#/$defs/DatasetFacet' },
            },
          ],
        },
      },
      required: ['namespace', 'name'],
    },
    StaticDataset: {
      description: 'A Dataset sent within static metadata events',
      type: 'object',
      allOf: [{ $ref: '#/$defs/Dataset' }],
    },
    DatasetFacet: {
      description: 'A Dataset Facet',
      type: 'object',
      allOf: [
        { $ref: '#/$defs/BaseFacet' },
        {
          type: 'object',
          properties: {
            _deleted: {
              description: 'set to true to delete a facet',
              type: 'boolean',
            },
          },
        },
      ],
    },
    BaseFacet: {
      description:
        'all fields of the base facet are prefixed with _ to avoid name conflicts in facets',
      type: 'object',
      properties: {
        _producer: {
          description:
            'URI identifying the producer of this metadata. For example this could be a git url with a given tag or sha',
          type: 'string',
          format: 'uri',
          example:
            'https://github.com/OpenLineage/OpenLineage/blob/v1-0-0/client',
        },
        _schemaURL: {
          description:
            'The JSON Pointer (https://tools.ietf.org/html/rfc6901) URL to the corresponding version of the schema definition for this facet',
          type: 'string',
          format: 'uri',
          example:
            'https://openlineage.io/spec/1-0-2/OpenLineage.json#/$defs/BaseFacet',
        },
      },
      additionalProperties: true,
      required: ['_producer', '_schemaURL'],
    },
  },
  oneOf: [
    { $ref: '#/$defs/RunEvent' },
    { $ref: '#/$defs/DatasetEvent' },
    { $ref: '#/$defs/JobEvent' },
  ],
} as const;
