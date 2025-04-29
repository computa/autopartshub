// frontend/src/pages/Search.jsx
import React, { useState } from 'react';
import { request } from '../api/index.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Search() {
  const [query, setQuery] = useState({ make: '', model: '', year: '', partNumber: '' });
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(null);

  const handle = e => setQuery({ ...query, [e.target.name]: e.target.value });

  async function doSearch(e) {
    e.preventDefault();
    setErr(null);
    try {
      const params = new URLSearchParams(query).toString();
      const data = await request(`/api/search?${params}`);
      setResults(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Search parts</h1>

      <form onSubmit={doSearch} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input name="make" placeholder="Make" onChange={handle} className="input" />
        <input name="model" placeholder="Model" onChange={handle} className="input" />
        <input name="year" placeholder="Year" onChange={handle} className="input" />
        <input name="partNumber" placeholder="Part #" onChange={handle} className="input" />
        <button className="btn-primary col-span-full md:col-auto">Search</button>
      </form>

      {err && <p className="text-red-600">{err}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {results.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

