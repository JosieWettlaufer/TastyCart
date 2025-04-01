// frontend/src/services/cartService.js
import api from './api';

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (product) => {
    try {
      const response = await api.post('/cart', product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};