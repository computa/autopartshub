// frontend/src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';      // hook may return undefined
import './ProductCard.css';

export default function ProductCard({ product }) {
  // useCart() returns undefined if the provider is missing ‑‑
  // in that case we fall back to an inert object so destructuring is safe.
  const cart = useCart() || {};
  const { addItem } = cart;

  // make sure price is always numeric
  const price = Number(product.price ?? 0);

  const handleAdd = () => {
    // guard again in case the button sneaks through before provider mounts
    if (typeof addItem === 'function') {
      /* What we put in cart: you can tweak shape as you like */
      addItem({
        part_id: product.id,
        name: product.name,
        price: price,
        quantity: 1,
      });
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-2xl"
      />

      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.make} {product.model} ({product.year})
        </p>
        <p className="text-sm">
          Part&nbsp;#: <strong>{product.partNumber}</strong>
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="price text-xl font-bold">${price.toFixed(2)}</span>

          {/* show the button only if addItem is available */}
          {addItem && (
            <button
              onClick={handleAdd}
              className="btn-primary px-3 py-1 rounded-lg text-sm"
            >
              Add&nbsp;to&nbsp;Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

