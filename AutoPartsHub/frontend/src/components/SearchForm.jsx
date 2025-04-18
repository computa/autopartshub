// frontend/src/components/SearchForm.jsx
import React, { useState } from 'react';
import './SearchForm.css';

export default function SearchForm({ onSearch }) {
  const [q, setQ] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [partNumber, setPartNumber] = useState('');

  const submit = e => {
    e.preventDefault();
    onSearch({ q, make, model, year, partNumber });
  };

  return (
    <form className="search-form" onSubmit={submit}>
      <div className="search-fields">
        <input
          type="text"
          placeholder="Keyword…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <input
          type="text"
          placeholder="Part #…"
          value={partNumber}
          onChange={e => setPartNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={e => setMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={e => setModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
      </div>
      <button type="submit">Search</button>
    </form>
  );
}

