import React, { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async ({ q, make }) => {
    const params = new URLSearchParams({ q, make });
    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="App">
      {/* TODO: replace with your Header component if you create one */}
      <h1>AutoPartsHub</h1>

      <SearchForm onSearch={handleSearch} />

      <SearchResults results={results} />

      {/* TODO: Footer here */}
    </div>
  );
}

export default App;

