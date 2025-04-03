import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../../components/AdminDashboard';
import { productService } from '../../services/productService';

// Mock dependencies
jest.mock('../../services/productService', () => ({
  productService: {
    getProducts: jest.fn().mockResolvedValue({
      products: [
        {
          _id: '1',
          productName: 'Test Cookie',
          price: 9.99,
          description: 'A delicious treat!',
          quantity: 10,
          category: 'Cookies',
          image: 'test-image-url'
        }
      ]
    }),
    updateProduct: jest.fn().mockResolvedValue({ status: 200 }),
    addProduct: jest.fn().mockResolvedValue({ 
      status: 201, 
      data: { 
        product: {
          _id: 'new-product-id',
          productName: 'New Test Product',
          price: 15.99,
          description: 'A new delicious treat!',
          quantity: 5,
          category: 'Cakes'
        }
      }
    }),
    deleteProduct: jest.fn().mockResolvedValue({ status: 200 })
  }
}));

jest.mock('../../services/authService', () => ({
  authService: {
    logout: jest.fn()
  }
}));

describe('AdminDashboard Component', () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test('submits new product when form is filled and saved', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard setUser={mockSetUser} />
      </BrowserRouter>
    );

    // Wait for products to load
    await screen.findByText('Product List');

    // Click "Add Product" button
    const addProductButton = screen.getByText('Add Product');
    fireEvent.click(addProductButton);

    // Find input fields by name attribute
    const productNameInput = screen.getByTestId('product-name-input');
    const priceInput = screen.getByTestId('price-input');
    const descriptionTextarea = screen.getByTestId('description-textarea');
    const quantityInput = screen.getByTestId('quantity-input');
    const categorySelect = screen.getByTestId('category-select');

    // Fill out the form
    fireEvent.change(productNameInput, { target: { value: 'New Test Product' } });
    fireEvent.change(priceInput, { target: { value: '15.99' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'A new delicious treat!' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.change(categorySelect, { target: { value: 'Cakes' } });

    // Click Save Changes button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Wait for the product to be added
    await waitFor(() => {
      expect(productService.addProduct).toHaveBeenCalledWith(expect.objectContaining({
        productName: 'New Test Product',
        price: 15.99,
        description: 'A new delicious treat!',
        quantity: 5,
        category: 'Cakes'
      }));
    });

    // Check that the alert was called with success message
    expect(global.alert).toHaveBeenCalledWith('Product added successfully');
  });
});