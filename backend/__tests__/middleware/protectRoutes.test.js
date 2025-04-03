// 6. Middleware Test (backend/__tests__/middleware/protectRoutes.test.js)
const jwt = require('jsonwebtoken');
const { User } = require('../../models/User');
const protectRoutes = require('../../middleware/protectRoutes');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      cookies: {},
      header: jest.fn(),
      originalUrl: ''
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  
  test('allows access with valid token', async () => {
    // Setup request with token
    req.header.mockReturnValueOnce('Bearer valid-token');
    
    // Mock JWT verification
    jwt.verify.mockReturnValueOnce({ id: 'user123', role: 'user' });
    
    // Call middleware
    await protectRoutes(req, res, next);
    
    // Verify token was verified and request passed through
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'your_super_secret_key');
    expect(req.user).toEqual({ id: 'user123', role: 'user' });
    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });
  
  test('blocks access without token', async () => {
    // No token in request
    req.header.mockReturnValueOnce(undefined);
    
    // Call middleware
    await protectRoutes(req, res, next);
    
    // Verify access was denied
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('checks admin role for admin routes', async () => {
    // Setup admin route request
    req.originalUrl = '/admin/product';
    req.header.mockReturnValueOnce('Bearer valid-token');
    
    // Mock JWT verification for non-admin user
    jwt.verify.mockReturnValueOnce({ id: 'user123', role: 'user' });
    
    // Mock finding user in database
    User.findById.mockResolvedValueOnce({ role: 'user' });
    
    // Call middleware
    await protectRoutes(req, res, next);
    
    // Verify admin access was denied
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Admin access only' });
    expect(next).not.toHaveBeenCalled();
  });
});