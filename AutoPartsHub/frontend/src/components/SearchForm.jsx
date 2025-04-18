import React, { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [q, setQ] = useState('');
  const [make, setMake] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({ q, make });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search parts…"
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <input
        type="text"
        placeholder="Make (e.g. Toyota)"
        value={make}
        onChange={e => setMake(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

