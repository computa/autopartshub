const express = require('express');
const path = require('path');
const searchRouter = require('./routes/search');

const app = express();

// mount the JSON-backed search API under /api
app.use('/api', searchRouter);

// serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

