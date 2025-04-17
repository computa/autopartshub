// backend/server.js
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// 1. Serve all the static files from the React build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 2. For any other route, send back React's index.html so client-side routing works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

