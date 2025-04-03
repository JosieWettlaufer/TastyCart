// src/__tests__/services/api.test.js
import axios from 'axios';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create a mock interceptors object
const requestUseMock = jest.fn();
const mockInterceptors = {
  request: {
    use: requestUseMock
  }
};

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: mockInterceptors
  }))
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates an axios instance with the right configuration', () => {
    // Import the api module which should trigger axios.create
    require('../../services/api');
    
    // Verify axios.create was called with the right config
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5690'
    });
  });

  test('adds token to request headers when available', () => {
    // Mock localStorage to return a token
    localStorageMock.getItem.mockReturnValue('test-token');
    
    // Reset modules to ensure clean import
    jest.resetModules();
    
    // Import the module which should set up the interceptor
    require('../../services/api');
    
    // Get the interceptor function that was passed to use()
    const interceptorFn = requestUseMock.mock.calls[0][0];
    
    // Create a mock config object
    const config = { headers: {} };
    
    // Call the interceptor function with the config
    const result = interceptorFn(config);
    
    // Check that the token was added correctly
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  test('does not add token to request headers when not available', () => {
    // Mock localStorage to return null
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset modules to ensure clean import
    jest.resetModules();
    
    // Import the module which should set up the interceptor
    require('../../services/api');
    
    // Get the interceptor function that was passed to use()
    const interceptorFn = requestUseMock.mock.calls[0][0];
    
    // Create a mock config object
    const config = { headers: {} };
    
    // Call the interceptor function with the config
    const result = interceptorFn(config);
    
    // Check that no Authorization header was added
    expect(result.headers.Authorization).toBeUndefined();
  });
});