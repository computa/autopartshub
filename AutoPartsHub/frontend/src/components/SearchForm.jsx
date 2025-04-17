import React, { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [partNumber, setPartNumber] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({ make, model, year, partNumber });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem 0' }}>
      <div>
        <label>
          Make:
          <input
            type="text"
            value={make}
            onChange={e => setMake(e.target.value)}
            placeholder="e.g. Toyota"
          />
        </label>
      </div>
      <div>
        <label>
          Model:
          <input
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
            placeholder="e.g. Camry"
          />
        </label>
      </div>
      <div>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="e.g. 2020"
          />
        </label>
      </div>
      <div>
        <label>
          Part #:
          <input
            type="text"
            value={partNumber}
            onChange={e => setPartNumber(e.target.value)}
            placeholder="e.g. 12345-ABC"
          />
        </label>
      </div>
      <button type="submit">Search</button>
    </form>
  );
}
