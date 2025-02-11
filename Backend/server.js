require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderSummaryRoutes = require('./routes/orderSummaryRoutes');

const Order = require('./models/Order');
const Table = require('./models/Table');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// Routes
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/summary', orderSummaryRoutes);

// MongoDB connection
const mongoURI = process.env.MONGOURI;
mongoose.connect(mongoURI, {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Test route
app.get('/', (req, res) => {
  res.send('LDPOS is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
