import React from 'react';
import SearchForm from './components/SearchForm';  // ← added this
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a  
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* Insert your SearchForm below */}
      <SearchForm onSearch={criteria => console.log('Searching for', criteria)} />

    </div>
  );
}

export default App;

