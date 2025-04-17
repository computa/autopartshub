// backend/server.js

const express = require('express');
const app = express();

// Health‑check route
app.get('/', (req, res) => {
  res.send('✅ AutoPartsHub backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
