import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, name, image, price, compatibility } = product;
  return (
    <div className="product-card" key={id}>
      <img src={image} alt={name} className="product-image"/>
      <h3 className="product-name">{name}</h3>
      <p className="product-price">${price.toFixed(2)}</p>
      <p className="product-compat">Fits: {compatibility.join(', ')}</p>
      <button>Add to Cart</button>
    </div>
  );
}
