// frontend/src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  // make 100 % sure price is numeric
  const price = Number(product.price ?? 0);

  /** add a *new* item with default quantity 1 */
  const handleAdd = () => addItem({ ...product, quantity: 1 });

  return (
    <div className="product-card">
      <img
        src={product.image || "/placeholder.png"}
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
          <span className="price text-xl font-bold">
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            className="btn-primary px-3 py-1 rounded-lg text-sm"
          >
            Add&nbsp;to&nbsp;Cart
          </button>
        </div>
      </div>
    </div>
  );
}

