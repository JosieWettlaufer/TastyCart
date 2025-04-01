import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import { productService } from '../services/productService';

const ProductsPage = () => {
    // Component now works with or without a logged-in user
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
                const data = await productService.getProducts();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    
    // Removed the user check to allow non-logged in users to view the dashboard

    const sortByCategory = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
        if (selectedCategory !== "All"){
            const filteredItems = products.filter(
            (item) => item.category === selectedCategory
            );
            setDisplayedItems(filteredItems);
        } else {
            setDisplayedItems(products);
        }
    };

    const sortByName = () => {
        const filteredItems = products.filter(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(filteredItems);
    };
    
    return (
        <div>
            {/* Search & Categories */}
            <section className="mb-5 text-center">
                <SearchBar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortByName = {sortByName}
                    sortByCategory = {sortByCategory}
                    selectedCategory={selectedCategory}
                />
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
        </div>
    ); 
};

export default ProductsPage;