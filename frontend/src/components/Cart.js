import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../services/cartService';

function Cart() {
  const [cart, setCart] = useState({ products: [], priceTotal: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    //Get cart data from database and set it to state variable when component mounts
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data.cart);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setCart({ products: [], priceTotal: 0 }); // Empty cart on error
      }
    };

    fetchCart();
  }, []);

  //Get/calculate cart total
  const calculateTotal = () => {
    // Use the cart's priceTotal or calculate manually if needed
    if (cart.priceTotal !== undefined) {
      return cart.priceTotal.toFixed(2);
    }
    
    // Fallback calculation if priceTotal isn't available
    return (cart.products || []).reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  //Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      //Remove item from database via API call
      await cartService.removeItem(itemId);

      // Update local state to remove the item
      setCart(prevCart => ({
        ...prevCart,
        products: (prevCart.products || []).filter(item => item._id !== itemId),
      }));
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  //Update cart item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    //if 0 exit function
    if (newQuantity < 1) return;

    try {
      //update quantity of item in cart via api call
      const response = await cartService.updateQuantity(itemId, newQuantity);

      // Set the cart to the updated cart from the server response
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
      } else {
        // Fallback to manual update if server doesn't return updated cart
        setCart(prevCart => ({
          ...prevCart,
          products: (prevCart.products || []).map(item => 
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          ),
          // Update priceTotal based on the updated products
          priceTotal: prevCart.products.reduce((total, item) => {
            const price = item.price || 0;
            const quantity = item._id === itemId ? newQuantity : (item.quantity || 1);
            return total + (price * quantity);
          }, 0)
        }));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      );
    }

    //return empty cart html if cart empty
    if (!cart.products || cart.products.length === 0) {
      return (
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <Link to="/dashboard" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      );
    }

  //otherwise return html with cart items
  return (
    <div className="container">
      <h1 className="mb-4">Your Cart</h1>
      <div className="row">
        <div className="col-md-8">
          {cart.products.map((item, index) => (
            <div key={item._id || `item-${index}`} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.productName || 'Unnamed Item'}</h5>
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
              <p className="card-text">Total Items: {cart.products.length}</p>
              <p className="card-text">
                Total Price: ${calculateTotal()}
              </p>
              <Link to="/cart/checkout">
                <button className="btn btn-success w-100">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;