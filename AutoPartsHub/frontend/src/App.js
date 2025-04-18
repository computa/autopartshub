import React, { useState } from 'react';
import './App.css';

import Header from './components/Header';          // optional
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async ({ q, make, model, year }) => {
    const params = new URLSearchParams();
    if (q)     params.append('q', q);
    if (make)  params.append('make', make);
    if (model) params.append('model', model);
    if (year)  params.append('year', year);

    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <>
      <Header />       {/* remove or comment out if you didn’t create one */}
      <main className="App">
        <SearchForm onSearch={handleSearch} />
        <SearchResults results={results} />
      </main>
      {/* <Footer /> if you have one */}
    </>
  );
}

export default App;

