import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Get the authentication token from local storage
        const token = localStorage.getItem('token');

        // Fetch cart items
        const response = await axios.get('http://localhost:5690/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // The response now directly contains items from the userCart
        setCart(response.data.cart || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError(err.response?.data?.message || 'Failed to load cart');
        setIsLoading(false);
        setCart([]); // Ensure cart is an empty array on error
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5690/cart/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state to remove the item
      setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');

      await axios.patch(`http://localhost:5690/cart/items/${itemId}`, 
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state with new quantity
      setCart(prevCart => prevCart.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center">
        <h2>Your Cart is Empty</h2>
        <Link to="/dashboard" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Your Cart</h1>
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div key={item._id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.name || 'Unnamed Item'}</h5>
                  <p className="card-text">Price: ${(item.price || 0).toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity || 1}</span>
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Cart Summary</h5>
              <p className="card-text">Total Items: {cart.length}</p>
              <p className="card-text">
                Total Price: ${calculateTotal()}
              </p>
              <button className="btn btn-success w-100">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;