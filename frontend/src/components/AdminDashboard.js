import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CloudinaryUpload from "./CloudinaryUpload";
import { productService } from "../services/productService";
import { authService } from "../services/authService";

//METHOD: access admin dashboard
const AdminDashboard = ({ setUser }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);                   
  const [displayedItems, setDisplayedItems] = useState([]);       
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
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
      image: imageUrl,
    });
  };

  useEffect(() => {
    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {

        //Get Products from database
        const data = await productService.getProducts();

        // Set API response to products and displayed items
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          setDisplayedItems(data.products);
        } else {
          console.error("Unexpected data format from API:", data);
          setError("Received invalid data format from server");
        }

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");

        // If server returns 401 and user was logged in, clear credentials
        if (err.response && err.response.status === 401) {
          authService.logout();
          if (setUser) setUser(null);
        }
      }
    };

    fetchProducts();
  }, [navigate, setUser]);

  //sort/display products by selected category 
  const sortByCategory = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
    if (selectedCategory !== "All") {
      const filteredItems = products.filter(
        (item) => item.category === selectedCategory
      );
      setDisplayedItems(filteredItems);
    } else {
      //If all is selected display all products
      setDisplayedItems(products);
    }
  };

  //Sort products by name
  const sortByName = () => {
    const filteredItems = products.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(filteredItems);
  };

  // Edit Product information function
  const handleEdit = (productId, isAdding) => {
    //If adding new product
    if (isAdding) {
      // Initialize all fields with empty/default values
      setEditFormData({
        image: "",
        productName: "",
        price: 0, // Make sure price is initialized
        description: "A delicious treat!", // Provide a default value
        quantity: 1,
        category: "Cookies", // Set a default category
      });

      setEditProductId(null);
      //state variable makes new product form appear
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

    // Set editing state to make form appear with product values in fields
    setEditProductId(productId);
    setIsEditing(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target; //name = name of input field, value = value of input field
    setEditFormData({
      ...editFormData,  //spread operator copies all previous state values
      //if input name equals price or quantity, convert to float. Otherwise take value as is
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //If editing product
      if (!isAdding) {
        //update product by id with form data
        const response = await productService.updateProduct(
          editProductId,
          editFormData
        );

        if (response.status === 200) {
          // Update products using products previous state and edit form data
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              //If prevProduct product id equals edited product id
              product._id === editProductId
                //override prevProduct with edit form data
                ? { ...product, ...editFormData, _id: product._id }
                //Otherwise map product as is
                : product
            )
          );

          //update displayed products by updating previous items with new form data
          setDisplayedItems((prevItems) =>
            prevItems.map((item) =>
              item._id === editProductId
                ? { ...item, ...editFormData, _id: item._id }
                : item
            )
          );

          // Reset editing state
          setIsEditing(false); //hides add/edit form 
          setEditProductId(null);

          alert("Product updated successfully");
        }
      } else {
        // Send add request containing form data
        const response = await productService.addProduct(editFormData);

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
      }
    } catch (err) {
      console.error("Error updating product", err);
      alert(
        `Failed to ${isAdding ? "add" : "update"} product: ${
          err.message || "Unknown error"
        }`
      );
    }
  };

  // Cancel editing 
  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditProductId(null);
  };

  //Delete product
  const handleDelete = async (productId) => {
    try {
      //Delete product from database
      const response = await productService.deleteProduct(productId);

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
          sortByName={sortByName}
          sortByCategory={sortByCategory}
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

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-4 p-3 border rounded">
          <h3>{isAdding ? "Add" : "Edit"} Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">

              {/* Product Image*/}
              <label className="form-label">Image Url</label>
              {/* Cloudinary image upload component*/}
              <CloudinaryUpload
                onImageUpload={handleImageUpload}
                currentImageUrl={editFormData.image}
              />
            </div>

            {/* Product Name*/}
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                name="productName"
                data-testid="product-name-input"
                value={editFormData.productName}
                onChange={handleFormChange}
                required
              />
            </div>

            {/* Product Price*/}
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                data-testid="price-input"
                value={editFormData.price}
                onChange={handleFormChange}
                step="0.01"
                required
              />
            </div>

            {/* Product Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                data-testid="description-textarea"
                value={editFormData.description}
                onChange={handleFormChange}
              />
            </div>

            {/* Product Quantity */}
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                data-testid="quantity-input"
                value={editFormData.quantity}
                onChange={handleFormChange}
                required
              />
            </div>

            {/* Product Category*/}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                data-testid="category-select"
                value={editFormData.category}
                onChange={handleFormChange}
              >
                {["Cakes", "Cookies", "Bread", "Pastries", "Muffins", "Other",
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

      {/* Display errors if any, if none display list of products */}
      <section className="mb-5">
        {error ? (
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
