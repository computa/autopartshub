import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <h1>AutoPartsHub</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}
