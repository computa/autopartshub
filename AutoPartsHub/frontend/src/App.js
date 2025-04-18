import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async criteria => {
    // build query string from criteria object
    const params = new URLSearchParams(criteria);
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <>
      <Header />

      <main className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>AutoPartsHub</h1>

        <SearchForm onSearch={handleSearch} />

        <SearchResults results={results} />
      </main>
    </>
  );
}

export default App;

