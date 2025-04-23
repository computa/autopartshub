require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRouter    = require('./routes/auth');
const meRouter      = require('./routes/me');
const searchRouter  = require('./routes/search');
const dbtestRouter  = require('./routes/dbtest');
const partsRouter   = require('./routes/parts');
const cartsRouter   = require('./routes/carts');
const ordersRouter  = require('./routes/orders');

const app = express();

// security & logging
app.use(helmet());
app.use(morgan('tiny'));

// only allow our frontend origin in production
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors(FRONTEND_URL
  ? { origin: FRONTEND_URL }
  : {}    // default to "*"
));

app.use(express.json());

// mount API routers
app.use('/api/auth', authRouter);
app.use('/api', meRouter);
app.use('/api', searchRouter);
app.use('/api', dbtestRouter);
app.use('/api/parts', partsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);

// 404 for any other /api/* 
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// serve React build, but only for non-API GETs
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

