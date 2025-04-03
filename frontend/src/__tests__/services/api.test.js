// src/__tests__/services/api.test.js
import axios from 'axios';

// Clear any previous mocks
jest.resetAllMocks();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create a mock interceptor function
const mockInterceptorFn = jest.fn(config => config);

// Create mock axios with interceptors
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn(fn => {
          // Store the interceptor function for testing
          mockInterceptorFn.mockImplementation(fn);
          return fn;
        })
      }
    }
  }))
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset modules to ensure a fresh import
    jest.resetModules();
  });

  test('creates an axios instance with the right configuration', () => {
    // Clear all mocks before running this test
    jest.clearAllMocks();
    
    // Force a fresh import which should trigger axios.create
    jest.isolateModules(() => {
      require('../../services/api');
    });
    
    // Now check that axios.create was called with the right config
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5690'
    });
  });

  test('adds token to request headers when available', () => {
    // Import the module
    require('../../services/api');
    
    // Set up the mock to return a token
    localStorageMock.getItem.mockReturnValueOnce('test-token');
    
    // Create a test config object
    const config = { headers: {} };
    
    // Call the interceptor function directly
    const result = mockInterceptorFn(config);
    
    // Verify token was added to headers
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  test('does not add token to request headers when not available', () => {
    // Import the module
    require('../../services/api');
    
    // Set up the mock to return null (no token)
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    // Create a test config object
    const config = { headers: {} };
    
    // Call the interceptor function directly
    const result = mockInterceptorFn(config);
    
    // Verify Authorization header was not added
    expect(result.headers.Authorization).toBeUndefined();
  });
});