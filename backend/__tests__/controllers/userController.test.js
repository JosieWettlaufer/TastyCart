// 5. Backend Controller Test (backend/__tests__/controllers/userController.test.js)
const { User, Product } = require('../../models/User');
const { loginUser, getProductByID, postCart } = require('../../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  
  describe('loginUser', () => {
    test('returns token and user details on successful login', async () => {
      // Setup request
      req.body = { username: 'testuser', password: 'password123' };
      
      // Mock user in database
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashed_password',
        email: 'test@example.com',
        role: 'user'
      };
      User.findOne.mockResolvedValueOnce(mockUser);
      
      // Mock bcrypt compare to return true (password matches)
      bcrypt.compare.mockResolvedValueOnce(true);
      
      // Mock JWT sign
      jwt.sign.mockReturnValueOnce('fake-jwt-token');
      
      // Call the controller
      await loginUser(req, res);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: 'fake-jwt-token',
        user: {
          id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });
    
    test('returns 400 for invalid credentials', async () => {
      req.body = { username: 'wronguser', password: 'wrongpass' };
      
      // User not found
      User.findOne.mockResolvedValueOnce(null);
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
  
  describe('postCart', () => {
    test('adds product to user cart', async () => {
      // Setup mock user with existing cart
      const mockUser = {
        _id: 'user123',
        userCart: {
          products: [],
          priceTotal: 0
        },
        save: jest.fn().mockResolvedValueOnce()
      };
      
      // Setup request with product to add
      req.body = {
        productName: 'Chocolate Cake',
        price: 15.99,
        quantity: 1
      };
      
      // Mock finding the user
      User.findById.mockResolvedValueOnce(mockUser);
      
      // Call the controller
      await postCart(req, res, next);
      
      // Verify user was found and product added to cart
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.userCart.products).toContainEqual(req.body);
      expect(mockUser.userCart.priceTotal).toBe(15.99);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'product added to cart successfully',
        cart: mockUser.userCart
      });
    });
  });
});