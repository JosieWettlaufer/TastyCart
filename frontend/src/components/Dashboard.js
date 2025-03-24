import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartBtn from './CartBtn';

const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products when component mounts
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5690/product', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Handle the specific API response format
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    console.error('Unexpected data format from API:', response.data);
                    setError('Received invalid data format from server');
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
                
                // If server returns 401, token might be invalid
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    navigate('/login');
                }
            }
        };

        fetchProducts();
    }, [navigate, setUser]);
    
    if (!user) {
        return <div>Error loading user</div>;
    }
    
    return (
        <div className="container">
            {/* User profile card */}
            <div className="card mt-4 p-4 mb-4 text-center">
                <h2>Welcome, {user.username}! <CartBtn /></h2>
            </div>
            
            {/* Products section */}
            <div className="mt-4">
                <h2 className="mb-4">Our Products</h2>
                
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {products.length > 0 ? (
                            products.map(product => (
                                <div className="col" key={product._id}>
                                    <ProductCard product={{
                                        id: product._id,
                                        image: product.image,
                                        name: product.productName,
                                        price: product.price,
                                        description: product.description,
                                        quantity: product.quantity,
                                        category: product.category
                                    }} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-info">
                                    No products available at the moment.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;