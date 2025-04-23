require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const authRouter   = require('./routes/auth');
const meRouter     = require('./routes/me');
const searchRouter = require('./routes/search');
const dbtestRouter = require('./routes/dbtest');
const partsRouter  = require('./routes/parts');
const cartsRouter  = require('./routes/carts');
const ordersRouter = require('./routes/orders');

const app = express();

// ─── global middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',  authRouter);
app.use('/api',       meRouter);        // /api/me
app.use('/api',       searchRouter);    // /api/search
app.use('/api',       dbtestRouter);    // /api/dbtest
app.use('/api/parts', partsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);

// ─── React build (must come *after* all API routes) ───────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
);

// ─── error fallback ───────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ─── start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀  Server listening on port ${PORT}`));

