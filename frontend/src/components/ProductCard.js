import React from 'react';

const ProductCard = ({ product }) => {

  return (
        <div className="card h-100">
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
            <button className="btn btn-primary w-100">Add to Cart</button>
        </div>
        </div>
  );
};

export default ProductCard;