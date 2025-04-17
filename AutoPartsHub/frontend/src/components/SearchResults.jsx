import React from 'react';
import ProductCard from './ProductCard';
import './SearchResults.css';

export default function SearchResults({ results }) {
  if (!results || !results.length) {
    return <p>No products found.</p>;
  }
  return (
    <div className="results-grid">
      {results.map(item => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
