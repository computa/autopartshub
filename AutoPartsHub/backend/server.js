require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const authRouter = require('./routes/auth');
const meRouter = require('./routes/me');
const searchRouter = require('./routes/search');
const dbtestRouter = require('./routes/dbtest');
const partsRouter = require('./routes/parts');
const cartsRouter = require('./routes/carts');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

// Authentication endpoints
app.use('/api/auth', authRouter);

// "Who am I?" protected endpoint
app.use('/api', meRouter);

// Search endpoint
app.use('/api', searchRouter);

// DB‐connection test
app.use('/api', dbtestRouter);

// Parts CRUD (admin only for POST/DELETE)
app.use('/api/parts', partsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);

// Serve React build for all other routes
// This should come AFTER all API routes
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
