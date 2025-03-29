import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminDashboard = ({ setUser }) => {
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

    const handleEdit = () => {

    }

    const handleDelete = async (productId) => {
        try {
            console.log(`Attempting to delete product: ${productId}`);
            
            // Make API call to delete product - NO AUTHENTICATION
            const response = await axios.delete(`http://localhost:5690/admin/product/${productId}`);
    
            console.log('Delete response:', response);
    
            if (response.status === 200) {
                // Update local state to remove the deleted product
                setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
                setDisplayedItems(prevItems => prevItems.filter(item => item._id !== productId));
                
                // Show success notification
                alert("Product deleted successfully");
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            
            // Log detailed error information
            if (err.response) {
                console.log('Error status:', err.response.status);
                console.log('Error data:', err.response.data);
            }
            
            alert(`Failed to delete product: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        }
    }
    
    return (
        <div>
            {/* Search & Categories */}
            <section className="mb-5 text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <div className="input-group" style={{ maxWidth: '500px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Find products" 
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

            {/* Products Section */}
            <div className='d-flex justify-content-between mb-3'>
            <h2>Product List</h2>
            <button className='btn btn-success'>Add Product</button>
            </div>
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
                    <ul className="list-group">
                        {products.length > 0 ? (
                            displayedItems.map(product => (
                                <li className="list-group-item p-3" key={product._id}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p>{product._id}</p>
                                            <p className="mb-1"><strong>Name:</strong> {product.productName}</p>
                                            <p className="mb-1"><strong>Price:</strong> ${product.price}</p>
                                            <p className="mb-1"><strong>Description:</strong> {product.description}</p>
                                            <p className="mb-1"><strong>Quantity:</strong> {product.quantity}</p>
                                            <p className="mb-0"><strong>Category:</strong> {product.category}</p>
                                        </div>
                                        <div>
                                            <button 
                                            className="btn btn-primary me-2" 
                                            onClick={handleEdit}
                                            >
                                                Edit
                                            </button>

                                            <button 
                                            className="btn btn-danger" 
                                            onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-info">
                                    No products available.
                                </div>
                            </div>
                        )}
                    </ul>
                )}
            </section>
        </div>
    ); 
};


export default AdminDashboard;