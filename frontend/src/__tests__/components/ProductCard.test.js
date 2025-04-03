// 4. ProductCard Component Test (frontend/src/__tests__/components/ProductCard.test.js)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';
import { cartService } from '../../services/cartService';

jest.mock('../../services/cartService');
jest.mock('@cloudinary/react', () => ({
  AdvancedImage: () => <img data-testid="cloudinary-image" alt=""/>
}));
jest.mock('@cloudinary/url-gen', () => ({
  Cloudinary: jest.fn().mockImplementation(() => ({
    image: jest.fn().mockReturnValue({
      format: jest.fn().mockReturnThis(),
      quality: jest.fn().mockReturnThis()
    })
  }))
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'prod123',
    name: 'Chocolate Cake',
    price: 15.99,
    description: 'Delicious chocolate cake',
    category: 'Cakes',
    image: 'cake_image.jpg'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'fake-token')
      }
    });
  });
  
  test('renders product correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText('Delicious chocolate cake')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('Category: Cakes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
  
  test('adds product to cart when button is clicked', async () => {
    cartService.addToCart.mockResolvedValueOnce({});
    
    render(<ProductCard product={mockProduct} />);
    
    // Click the "Add to Cart" button
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    // Verify the cart service was called with the right product
    await waitFor(() => {
      expect(cartService.addToCart).toHaveBeenCalledWith(expect.objectContaining({
        productName: 'Chocolate Cake',
        price: 15.99,
        description: 'Delicious chocolate cake',
        category: 'Cakes',
        productId: 'prod123'
      }));
    });
    
    // Check for success notification
    expect(screen.getByText('Product added to cart!')).toBeInTheDocument();
  });
});