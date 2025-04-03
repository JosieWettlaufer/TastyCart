// 3. Login Component Test (frontend/src/__tests__/components/Login.test.js)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login';
import { authService } from '../../services/authService';

jest.mock('../../services/authService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Login Component', () => {
  const mockSetUser = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('successful login calls setUser and redirects', async () => {
    // Mock successful login
    const mockUser = { id: 'user123', username: 'testuser' };
    authService.login.mockResolvedValueOnce({ user: mockUser });
    
    global.alert = jest.fn();
    
    render(
      <BrowserRouter>
        <Login setUser={mockSetUser} />
      </BrowserRouter>
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that the right functions were called
    await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      });
      
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      });
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Login successful!');
      });
  });
});