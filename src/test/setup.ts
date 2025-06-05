import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Date to ensure consistent test results
const mockDate = new Date('2024-01-01');
global.Date = class extends Date {
  constructor() {
    super();
    return mockDate;
  }
} as DateConstructor; 