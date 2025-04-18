// frontend/src/components/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>
        {product.make} {product.model} ({product.year})
      </p>
      <p>Part #: <strong>{product.partNumber}</strong></p>
      <p className="price">${product.price.toFixed(2)}</p>
    </div>
  );
}

