import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import CloudinaryUpload from "./CloudinaryUpload";

const AdminDashboard = ({ setUser }) => {
  // Component now works with or without a logged-in user
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productName: "",
    price: 0,
    description: "",
    quantity: 0,
    category: "Cookies",
  });

  // Handle image upload from CloudinaryUpload component
  const handleImageUpload = (imageUrl) => {
    setEditFormData({
      ...editFormData,
      image: imageUrl
    });
  };

  useEffect(() => {
    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Modified to handle both logged-in and non-logged-in states
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5690/product", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        // Handle the specific API response format
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setDisplayedItems(response.data.products);
        } else {
          console.error("Unexpected data format from API:", response.data);
          setError("Received invalid data format from server");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);

        // If server returns 401 and user was logged in, clear credentials
        // but don't redirect, just show products for non-logged in users
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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
    const filteredItems = products.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(filteredItems);
  };

  // Simple edit function
  const handleEdit = (productId, isAdding) => {
    if (isAdding) {
      // Initialize all required fields with default values
      setEditFormData({
        image: "",
        productName: "",
        price: 0, // Make sure price is initialized
        description: "A delicious treat!", // Provide a default value
        quantity: 1,
        category: "Cookies", // Set a default category
      });

      setEditProductId(null);
      setIsEditing(true);
      return;
    }

    // Find the product to edit
    const productToEdit = products.find((product) => product._id === productId);

    if (!productToEdit) {
      alert("Product not found");
      return;
    }

    // Set the form data with current product values
    setEditFormData({
      image: productToEdit.image,
      productName: productToEdit.productName,
      price: productToEdit.price,
      description: productToEdit.description,
      quantity: productToEdit.quantity,
      category: productToEdit.category,
    });

    // Set editing state
    setEditProductId(productId);

    setIsEditing(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]:
        name === "price"
          ? parseFloat(value)
          : name === "quantity"
          ? parseInt(value)
          : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get token from local storage
    const token = localStorage.getItem("token");

    console.log("Submitting form with data:", editFormData);
    console.log("Product ID to update:", editProductId);

    if (!isAdding) {
      console.log(
        "API endpoint being called:",
        `http://localhost:5690/admin/product/${editProductId}`
      );

      // Send update request
      axios
        .put(
          `http://localhost:5690/admin/product/${editProductId}`,
          editFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Update response:", response);

          if (response.status === 200) {
            // Update local state
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product._id === editProductId
                  ? { ...product, ...editFormData, _id: product._id }
                  : product
              )
            );

            setDisplayedItems((prevItems) =>
              prevItems.map((item) =>
                item._id === editProductId
                  ? { ...item, ...editFormData, _id: item._id }
                  : item
              )
            );

            // Reset editing state
            setIsEditing(false);
            setEditProductId(null);

            alert("Product updated successfully");
          }
        })
        .catch((err) => {
          console.error("Error updating product. Full error:", err);

          if (err.response) {
            console.log("Error status:", err.response.status);
            console.log("Error data:", err.response.data);
          } else if (err.request) {
            // Request was made but no response received
            console.log("No response received:", err.request);
          } else {
            // Something happened in setting up the request
            console.log("Request setup error:", err.message);
          }

          alert(
            `Failed to update product: ${
              err.response?.data?.message || err.message || "Unknown error"
            }`
          );
        });
    } else {
      console.log("Full data being sent:", JSON.stringify(editFormData));
      console.log(
        "API endpoint being called:",
        "http://localhost:5690/admin/product"
      );

      // Send add request
      axios
        .post("http://localhost:5690/admin/product", editFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Add response:", response);

          if (response.status === 201 || response.status === 200) {
            // Get the newly created product from the response
            const newProduct = response.data.product;

            // Update local state with the new product
            setProducts([...products, newProduct]);
            setDisplayedItems([...displayedItems, newProduct]);

            // Reset editing state
            setIsEditing(false);
            setIsAdding(false);
            setEditProductId(null);

            alert("Product added successfully");
          }
        })
        .catch((err) => {
          console.error("Error adding product. Full error:", err);

          if (err.response) {
            console.log("Error status:", err.response.status);
            console.log("Error data:", err.response.data);
          } else if (err.request) {
            // Request was made but no response received
            console.log("No response received:", err.request);
          } else {
            // Something happened in setting up the request
            console.log("Request setup error:", err.message);
          }

          alert(
            `Failed to add product: ${
              err.response?.data?.message || err.message || "Unknown error"
            }`
          );
        });
    }
  };

  // Cancel editing - THIS FUNCTION WAS MISSING
  const handleCancel = () => {
    console.log("Cancel button clicked");
    setIsEditing(false);
    setIsAdding(false);
    setEditProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      console.log(`Attempting to delete product: ${productId}`);

      const token = localStorage.getItem("token");

      // Make API call to delete product - NO AUTHENTICATION
      const response = await axios.delete(
        `http://localhost:5690/admin/product/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Delete response:", response);

      if (response.status === 200) {
        // Update local state to remove the deleted product
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        setDisplayedItems((prevItems) =>
          prevItems.filter((item) => item._id !== productId)
        );

        // Show success notification
        alert("Product deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting product:", err);

      // Log detailed error information
      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);
      }

      alert(
        `Failed to delete product: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    }
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

      {/* Products Section */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Product List</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setIsAdding(true);
            handleEdit(null, true);
          }}
          disabled={isEditing || isAdding}
        >
          Add Product
        </button>
      </div>

      {/* Edit Form - Add this after your product list section */}
      {isEditing && (
        <div className="mt-4 p-3 border rounded">
          <h3>{isAdding ? "Add" : "Edit"} Product</h3>
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label className="form-label">Image Url</label>
              <CloudinaryUpload 
              onImageUpload={handleImageUpload}
              currentImageUrl={editFormData.image}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                name="productName"
                value={editFormData.productName}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={editFormData.price}
                onChange={handleFormChange}
                step="0.01"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={editFormData.description}
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={editFormData.quantity}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={editFormData.category}
                onChange={handleFormChange}
              >
                {[
                  "Cakes",
                  "Cookies",
                  "Bread",
                  "Pastries",
                  "Muffins",
                  "Other",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              displayedItems.map((product) => (
                <li className="list-group-item p-3" key={product._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p>{product._id}</p>
                      <p className="mb-1">
                        <strong>Image URL:</strong> {product.image}
                      </p>
                      <p className="mb-1">
                        <strong>Name:</strong> {product.productName}
                      </p>
                      <p className="mb-1">
                        <strong>Price:</strong> ${product.price}
                      </p>
                      <p className="mb-1">
                        <strong>Description:</strong> {product.description}
                      </p>
                      <p className="mb-1">
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p className="mb-0">
                        <strong>Category:</strong> {product.category}
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                          handleEdit(product._id);
                        }}
                        disabled={isEditing || isAdding}
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
                <div className="alert alert-info">No products available.</div>
              </div>
            )}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
