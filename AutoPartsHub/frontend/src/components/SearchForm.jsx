import React, { useState, useEffect } from 'react';
import './SearchForm.css';

export default function SearchForm({ onSearch }) {
  const [mode, setMode] = useState('text');    // 'text' or 'part'
  const [q, setQ] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (mode === 'part') {
      onSearch({ partNumber });
    } else {
      onSearch({ q, make, model, year });
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-mode-toggle">
        <label>
          <input
            type="radio"
            name="mode"
            value="text"
            checked={mode === 'text'}
            onChange={() => setMode('text')}
          />
          Search by name/filters
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="part"
            checked={mode === 'part'}
            onChange={() => setMode('part')}
          />
          Search by Part #
        </label>
      </div>

      {mode === 'part'
        ? (
          <div className="field-group">
            <label>Part Number</label>
            <input
              type="text"
              value={partNumber}
              onChange={e => setPartNumber(e.target.value)}
              placeholder="e.g. 123-XYZ"
            />
          </div>
        )
        : (
          <>
            <div className="field-group">
              <label>Free text</label>
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="e.g. Brake"
              />
            </div>
            <div className="field-group">
              <label>Make</label>
              <input
                type="text"
                value={make}
                onChange={e => setMake(e.target.value)}
                placeholder="Toyota"
              />
            </div>
            <div className="field-group">
              <label>Model</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="Corolla"
              />
            </div>
            <div className="field-group">
              <label>Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="2019"
              />
            </div>
          </>
        )
      }

      <button type="submit">Search</button>
    </form>
  );
}

