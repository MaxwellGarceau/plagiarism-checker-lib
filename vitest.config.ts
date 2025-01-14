import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true, // Enable global test methods like `describe` and `it`
		environment: 'node', // Set the test environment (e.g., 'jsdom' for browser-like testing)
		coverage: {
			provider: 'v8', // default
			reporter: ['text', 'lcov'], // Generate text and lcov coverage reports
		},
	},
});
