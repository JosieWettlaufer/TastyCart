import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

const Dashboard = ({ user, setUser }) => {
    // Component now works with or without a logged-in user
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category
    const [searchQuery, setSearchQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products when component mounts
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Modified to handle both logged-in and non-logged-in states
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5690/product', {
                    headers: token ? {
                        Authorization: `Bearer ${token}`
                    } : {}
                });
                
                // Handle the specific API response format
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                    setDisplayedItems(response.data.products);
                } else {
                    console.error('Unexpected data format from API:', response.data);
                    setError('Received invalid data format from server');
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
                
                // If server returns 401 and user was logged in, clear credentials
                // but don't redirect, just show products for non-logged in users
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (setUser) setUser(null);
                    // Don't navigate away, let them stay on dashboard
                }
            }
        };

        fetchProducts();
    }, [navigate, setUser]);
    
    // Removed the user check to allow non-logged in users to view the dashboard

    const sortByCategory = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
        const filteredItems = products.filter(item => item.category === selectedCategory);
        setDisplayedItems(filteredItems);
    };

    const sortByName = () => {
        const filteredItems = products.filter(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(filteredItems);
    };
    
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="bg-light text-center py-5 mb-4">
                <div className="py-5">
                    <h2 className="display-4 fw-bold mb-4">
                        Freshly Baked Happiness, Delivered to Your Door.
                    </h2>
                    <p className="lead mb-4">
                        Discover homemade treats from passionate local bakers.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/login">
                            <button className="btn btn-warning btn-lg">
                                Shop Now
                            </button>
                        </Link>
                        <Link to="/login">
                                <button className="btn btn-outline-warning btn-lg me-2">
                                    Become a Seller
                                </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Search & Categories */}
            <section className="mb-5 text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <div className="input-group" style={{ maxWidth: '500px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Find delicious treats…" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-warning" onClick={sortByName}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-center flex-wrap gap-2">
                    {["Cakes", "Cookies", "Bread", "Pastries", "Muffins", "Other"].map((category) => (
                        <button
                            key={category}
                            className={`btn me-2 mb-2 ${
                                selectedCategory === category ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => sortByCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="mb-5">
                {loading ? (
                    <div className="text-center p-5">
                        <div className="spinner-border text-warning" role="status">
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
                            displayedItems.map(product => (
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
            </section>

            {/* How It Works */}
            <section className="bg-light py-5 text-center mb-4">
                <h3 className="display-6 fw-bold mb-4">How It Works</h3>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">1. Browse Products</h4>
                                <p className="card-text">Explore categories and discover unique homemade goods.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">2. Place Your Order</h4>
                                <p className="card-text">Add your favorites to the cart and checkout easily.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">3. Get It Delivered</h4>
                                <p className="card-text">Enjoy fresh baked goods delivered straight to your door.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    ); 
};

export default Dashboard;