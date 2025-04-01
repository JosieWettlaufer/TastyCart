import { addProductInfo } from '../../../backend/controllers/adminController';
import api from './api';

export const productService = {
    //get all products
    getProducts: async (category = null) => {
        const url = category ? `/product?category=${category}` : '/product';
        try {
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (productId) => {
        try {
            const response = await api.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addProduct: async (productData) => {
        try {
            const response = await api.post('/admin/product', productData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/product/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};