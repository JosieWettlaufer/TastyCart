// 2. Cart Service Test (frontend/src/__tests__/services/cartService.test.js)
import { cartService } from '../../services/cartService';
import api from '../../services/api';

jest.mock('../../services/api');

describe('Cart Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('addToCart sends correct data to API', async () => {
    const mockProduct = {
      productName: 'Chocolate Cake',
      price: 15.99,
      description: 'Delicious chocolate cake',
      quantity: 1,
      category: 'Cakes'
    };
    
    const mockResponse = { data: { message: 'Product added to cart' } };
    api.post.mockResolvedValueOnce(mockResponse);
    
    await cartService.addToCart(mockProduct);
    
    expect(api.post).toHaveBeenCalledWith('/cart', mockProduct);
  });
  
  test('removeItem calls correct API endpoint', async () => {
    const itemId = 'item123';
    const mockResponse = { data: { message: 'Item removed' } };
    api.delete.mockResolvedValueOnce(mockResponse);
    
    await cartService.removeItem(itemId);
    
    expect(api.delete).toHaveBeenCalledWith(`/cart/${itemId}`);
  });
});