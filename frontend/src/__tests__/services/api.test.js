// frontend/src/__tests__/services/api.test.js
// Now import the api module
import api from '../../services/api';
import axios from 'axios';

// Mock axios 
jest.mock('axios', () => ({
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: jest.fn()
        }
      }
    }))
  }));
  
  
  
  describe('API Service', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
      localStorage.clear();
      localStorage.getItem = jest.fn();
    });
  
    test('creates an axios instance with the right configuration', () => {
      // Check if axios.create was called with the correct baseURL
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:5690'
      });
    });
  
    test('adds token to request headers when available', () => {
      // Get the request interceptor function
      const interceptor = api.interceptors.request.use.mock.calls[0][0];
      
      // Mock config object
      const config = { headers: {} };
      
      // Mock localStorage to return a token
      localStorage.getItem.mockReturnValue('test-token');
      
      // Call the interceptor
      const result = interceptor(config);
      
      // Verify token was added to headers
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });
    
    test('does not add token to request headers when not available', () => {
      // Get the request interceptor function
      const interceptor = api.interceptors.request.use.mock.calls[0][0];
      
      // Mock config object
      const config = { headers: {} };
      
      // Mock localStorage to return null
      localStorage.getItem.mockReturnValue(null);
      
      // Call the interceptor
      const result = interceptor(config);
      
      // Verify token was not added to headers
      expect(result.headers.Authorization).toBeUndefined();
    });
  });