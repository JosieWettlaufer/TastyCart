// 1. Authentication Service Test (frontend/src/__tests__/services/authService.test.js)
import { authService } from '../../services/authService';
import api from '../../services/api';

jest.mock('../../services/api');

describe('Authentication Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('login stores token and user data on success', async () => {
    // Mock successful login API response
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        user: { id: 'user123', username: 'testuser', role: 'user' }
      }
    };
    api.post.mockResolvedValueOnce(mockResponse);
    
    // Call login function
    await authService.login({ username: 'testuser', password: 'password123' });
    
    // Check localStorage was updated correctly
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
    
    // Check API was called with correct parameters
    expect(api.post).toHaveBeenCalledWith('/login', { username: 'testuser', password: 'password123' }, { withCredentials: true });
  });
  
  test('logout removes token and user data', () => {
    // Setup localStorage with fake data
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 'user123' }));
    
    // Call logout function
    authService.logout();
    
    // Verify localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});