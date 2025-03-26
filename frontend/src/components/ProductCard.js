import React, { useState } from 'react';
import axios from 'axios';

const ProductCard = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);
    // We'll use this for a toast/alert message that shows temporarily
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const handleAddToCart = async () => {
        // Check if user logged in
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login
            window.location.href = '/login';
            return;
        }

        try {
            setIsAdding(true);

            // Format product data for api call
            const productToAdd = {
                productName: product.name,
                price: product.price,
                description: product.description,
                quantity: 1,
                category: product.category,
                productId: product.id
            };
        
            // Make API call to add product to cart
            await axios.post('http://localhost:5690/cart', productToAdd, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Show success notification (instead of alert)
            setNotification({
                show: true,
                message: 'Product added to cart!',
                type: 'success'
            });
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
            
        } catch (err) {
            console.error('Error adding to cart:', err);
            
            // Show error notification (instead of alert)
            setNotification({
                show: true, 
                message: 'Failed to add product to cart',
                type: 'error'
            });
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="card h-100 position-relative">
            {/* Notification toast */}
            {notification.show && (
                <div className={`position-absolute top-0 start-50 translate-middle-x p-2 badge ${
                    notification.type === 'success' ? 'bg-success' : 'bg-danger'
                }`} style={{ zIndex: 1 }}>
                    {notification.message}
                </div>
            )}
            
            <img 
                src={product.image || "https://via.placeholder.com/150"} 
                className="card-img-top" 
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                <p className='card-text'>Quantity: {product.quantity}</p>
                <p className='card-text'>Category: {product.category}</p>
            </div>
            <div className="card-footer">
                <button 
                    className="btn btn-primary w-100" 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    {isAdding ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding...
                        </>
                    ) : (
                        'Add to Cart'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;