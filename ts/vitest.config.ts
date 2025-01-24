import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ['./tests/setup.ts'],
    reporters: ['junit', 'json', 'verbose'],
    outputFile: {
      junit: 'coverage/junit-report.xml',
      json: 'coverage/json-report.json',
    },
  },
  resolve: {
    alias: {
      dotenv: 'dotenv' 
    },
  },
});
