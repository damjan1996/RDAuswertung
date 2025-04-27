// Set up jest-dom
require('@testing-library/jest-dom');

// global mocks
global.mockTest = jest.fn(() => true);

// Mock for Next.js useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    pathname: '/',
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    isFallback: false
  })
}));

// Dummy enable for running tests without actual test implementations
beforeAll(() => {
  if (process.env.NODE_ENV === 'test') {
    // Suppress console.error and console.warn during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  }
});

afterAll(() => {
  if (process.env.NODE_ENV === 'test') {
    // Restore console mocks
    console.error.mockRestore();
    console.warn.mockRestore();
  }
});