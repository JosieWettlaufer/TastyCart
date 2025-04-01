import React, { useState } from "react";
//Cloudinary imports
import {Cloudinary} from "@cloudinary/url-gen";
import { AdvancedImage } from '@cloudinary/react';
import { cartService } from "../services/cartService";

const ProductCard = ({ product }) => {
  const cld = new Cloudinary({ cloud: { cloudName: "dl3dsnroa" } });

  // Use this sample image or upload your own via the Media Explorer
  const img = product.image
  ? cld.image(product.image)
    .format("auto")
    .quality("auto")
  : cld.image("samples/dessert-on-a-plate")
    .format("auto") // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality("auto")
    

  const [isAdding, setIsAdding] = useState(false);
  // We'll use this for a toast/alert message that shows temporarily
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleAddToCart = async () => {
    // Check if user logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login
      window.location.href = "/login";
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
        productId: product.id,
      };

      // Make API call to add product to cart
      await cartService.addToCart(productToAdd);

      // Show success notification (instead of alert)
      setNotification({
        show: true,
        message: "Product added to cart!",
        type: "success",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);

      // Show error notification (instead of alert)
      setNotification({
        show: true,
        message: "Failed to add product to cart",
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card h-100 position-relative">
      {/* Notification toast */}
      {notification.show && (
        <div
          className={`position-absolute top-0 start-50 translate-middle-x p-2 badge ${
            notification.type === "success" ? "bg-success" : "bg-danger"
          }`}
          style={{ zIndex: 1 }}
        >
          {notification.message}
        </div>
      )}

      <div className="card-img-top" style={{ height: "200px", overflow: "hidden"  }}>
      <AdvancedImage
       cldImg={img}
       style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover",
        objectPosition: "center"
      }}
       />
      </div>

      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-truncate">{product.description}</p>
        <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
        <p className="card-text">Category: {product.category}</p>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-primary w-100"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
