import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ['./tests/setup.ts'],
    outputFile: {
      junit: './junit.xml'  // Specify the output location for the junit report
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    },
  },
  resolve: {
    alias: {
      dotenv: 'dotenv' 
    },
  },
});
