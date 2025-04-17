// backend/server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Health‑check endpoint
app.get('/health', (req, res) => {
  res.send('✅ Backend is healthy');
});

// All other GET requests should return React’s index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

