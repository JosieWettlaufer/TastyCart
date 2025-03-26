import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ products: [], priceTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'Credit Card' // Default payment method
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cart data when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login if not authenticated
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5690/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setCart(response.data.cart || { products: [], priceTotal: 0 });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.response?.data?.message || 'Failed to load cart data');
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cart has items
    if (!cart.products || cart.products.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate shipping address is provided
    if (!formData.shippingAddress.trim()) {
      setError('Shipping address is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const orderData = {
        orderItems: cart,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalPrice: cart.priceTotal
      };

      // Create the order
      const response = await axios.post('http://localhost:5690/orders', orderData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Handle successful order creation
      alert('Order placed successfully!');
      navigate('/dashboard', { state: { order: response.data.order } });
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If no items in cart, show message and redirect to products
  if (!cart.products || cart.products.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checkout.</p>
        <Link to="/dashboard" className="btn btn-primary mt-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Checkout</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        {/* Order Summary Section */}
        <div className="col-md-5 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Items ({cart.products.length}):</span>
                <span>${cart.priceTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${cart.priceTotal.toFixed(2)}</strong>
              </div>
              
              <div className="mt-4">
                <h6 className="mb-3">Items in Your Cart:</h6>
                {cart.products.map((item, index) => (
                  <div key={item._id || `item-${index}`} className="d-flex justify-content-between mb-2">
                    <div>
                      <span>{item.productName || 'Unnamed Item'}</span>
                      <span className="text-muted"> x {item.quantity || 1}</span>
                    </div>
                    <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="col-md-7">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Shipping & Payment</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Shipping Address */}
                <div className="mb-4">
                  <h6 className="mb-3">Shipping Address</h6>
                  <div className="mb-3">
                    <label htmlFor="shippingAddress" className="form-label">
                      Full Address
                    </label>
                    <textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      className="form-control"
                      rows="3"
                      placeholder="Street address, city, state, zip code"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mb-4">
                  <h6 className="mb-3">Payment Method</h6>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="creditCard"
                      value="Credit Card"
                      checked={formData.paymentMethod === 'Credit Card'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="creditCard">
                      Credit Card
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      value="PayPal"
                      checked={formData.paymentMethod === 'PayPal'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paypal">
                      PayPal
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cashOnDelivery"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="cashOnDelivery">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                
                {/* Submit Order Button */}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;