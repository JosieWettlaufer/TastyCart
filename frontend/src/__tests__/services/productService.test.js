// src/__tests__/services/productService.test.js
import { productService } from '../../services/productService';
import api from '../../services/api';

// Mock the API module
jest.mock('../../services/api');

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getProducts fetches all products when no category is provided', async () => {
    // Setup mock response
    const mockProducts = [
      { _id: 'prod1', productName: 'Chocolate Cake', category: 'Cakes' },
      { _id: 'prod2', productName: 'Vanilla Cookies', category: 'Cookies' }
    ];
    
    api.get.mockResolvedValueOnce({ data: { products: mockProducts } });
    
    // Call the service method
    const result = await productService.getProducts();
    
    // Check if API was called correctly
    expect(api.get).toHaveBeenCalledWith('/product');
    
    // Check if correct data was returned
    expect(result).toEqual({ products: mockProducts });
  });
  
  test('getProducts uses category parameter when provided', async () => {
    // Setup mock response
    const mockProducts = [
      { _id: 'prod1', productName: 'Chocolate Cake', category: 'Cakes' }
    ];
    
    api.get.mockResolvedValueOnce({ data: { products: mockProducts } });
    
    // Call the service method with category
    const result = await productService.getProducts('Cakes');
    
    // Check if API was called with correct URL
    expect(api.get).toHaveBeenCalledWith('/product?category=Cakes');
    
    // Check if correct data was returned
    expect(result).toEqual({ products: mockProducts });
  });
  
  test('getProductById fetches a specific product', async () => {
    // Setup mock response
    const mockProduct = { 
      _id: 'prod1', 
      productName: 'Chocolate Cake', 
      category: 'Cakes',
      price: 15.99
    };
    
    api.get.mockResolvedValueOnce({ data: { product: mockProduct } });
    
    // Call the service method
    const result = await productService.getProductById('prod1');
    
    // Check if API was called with correct URL
    expect(api.get).toHaveBeenCalledWith('/product/prod1');
    
    // Check if correct data was returned
    expect(result).toEqual({ product: mockProduct });
  });
  
  test('addProduct sends product data to API', async () => {
    // Setup mock product data
    const productData = {
      productName: 'New Cake',
      price: 19.99,
      description: 'A delicious new cake',
      category: 'Cakes'
    };
    
    // Setup mock response
    const mockResponse = { 
      data: {
        message: 'Product added successfully',
        product: { ...productData, _id: 'newprod1' }
      }
    };
    
    api.post.mockResolvedValueOnce(mockResponse);
    
    // Call the service method
    const result = await productService.addProduct(productData);
    
    // Check if API was called correctly
    expect(api.post).toHaveBeenCalledWith('/admin/product', productData);
    
    // Check if response was returned
    expect(result).toEqual(mockResponse);
  });
  
  test('updateProduct updates existing product', async () => {
    // Setup mock product update data
    const productId = 'prod1';
    const updateData = {
      price: 24.99,
      description: 'Updated description'
    };
    
    // Setup mock response
    const mockResponse = { 
      data: {
        message: 'Product updated successfully'
      },
      status: 200
    };
    
    api.put.mockResolvedValueOnce(mockResponse);
    
    // Call the service method
    const result = await productService.updateProduct(productId, updateData);
    
    // Check if API was called correctly
    expect(api.put).toHaveBeenCalledWith(`/admin/product/${productId}`, updateData);
    
    // Check if response was returned
    expect(result).toEqual(mockResponse);
  });
  
  test('deleteProduct removes a product', async () => {
    // Setup product ID
    const productId = 'prod1';
    
    // Setup mock response
    const mockResponse = {
      data: {
        message: 'Product deleted successfully'
      },
      status: 200
    };
    
    api.delete.mockResolvedValueOnce(mockResponse);
    
    // Call the service method
    const result = await productService.deleteProduct(productId);
    
    // Check if API was called correctly
    expect(api.delete).toHaveBeenCalledWith(`/admin/product/${productId}`);
    
    // Check if response was returned
    expect(result).toEqual(mockResponse);
  });
  
  test('handles errors in API calls', async () => {
    // Setup API to throw an error
    const error = new Error('Network error');
    api.get.mockRejectedValueOnce(error);
    
    // Call the service method and expect it to throw
    await expect(productService.getProducts()).rejects.toThrow(error);
  });
});