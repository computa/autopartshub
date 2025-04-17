import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} AutoPartsHub. All rights reserved.</p>
    </footer>
  );
}
