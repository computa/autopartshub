import React, { useState } from 'react';
import './App.css';
// import Header from './components/Header';  // optional
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async (criteria) => {
    // criteria might be { partNumber } or { q, make, model, year }
    const qs = new URLSearchParams(criteria).toString();
    const res = await fetch(`/api/search?${qs}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="App">
      {/* <Header /> */}
      <h1>AutoPartsHub</h1>

      <SearchForm onSearch={handleSearch} />

      <SearchResults results={results} />

      {/* <Footer /> */}
    </div>
  );
}

export default App;

