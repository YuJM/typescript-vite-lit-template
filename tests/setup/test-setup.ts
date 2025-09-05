/**
 * Global test setup for Vitest
 * This file is imported before running tests
 */
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test setup
beforeAll(() => {
  // Setup code that runs once before all tests
  console.log('🧪 Starting test suite...');
});

afterAll(() => {
  // Cleanup code that runs once after all tests
  console.log('✅ Test suite completed');
});

beforeEach(() => {
  // Setup code that runs before each test
  // Clear any global state if needed
});

afterEach(() => {
  // Cleanup code that runs after each test
  // Reset any global state
});

// Custom matchers can be extended here
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeAccessible(): T;
    toHaveValidLitElement(): T;
  }
}