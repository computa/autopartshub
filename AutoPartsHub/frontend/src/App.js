import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';

function App() {
  // state to hold search results
  const [results, setResults] = React.useState([]);

  // called when the form submits
  const handleSearch = (criteria) => {
    console.log('Searching for', criteria);
    // TODO: replace with real API call
    // Here’s some dummy data to test your UI:
    setResults([
      {
        id: 1,
        name: 'Brake Pad',
        image: '/images/brake-pad.jpg',
        price: 49.99,
        compatibility: ['Toyota Camry 2020'],
      },
      {
        id: 2,
        name: 'Air Filter',
        image: '/images/air-filter.jpg',
        price: 19.99,
        compatibility: ['Honda Civic 2019'],
      },
    ]);
  };

  return (
    <>
      <Header />
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p>
        </header>

        {/* search form */}
        <SearchForm onSearch={handleSearch} />

        {/* results grid */}
        <SearchResults results={results} />
      </main>
      <Footer />
    </>
  );
}

export default App;

