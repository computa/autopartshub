// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';

function App() {
  const [results, setResults] = useState([]);
  const handleSearch = async criteria => {
    const params = new URLSearchParams(criteria);
    const res = await fetch(`/api/search?${params}`);
    setResults(await res.json());
  };

  return (
    <>
      <Header />
      <main className="App">
        <SearchForm onSearch={handleSearch} />
        <SearchResults results={results} />
      </main>
      <Footer />
    </>
  );
}

export default App;

