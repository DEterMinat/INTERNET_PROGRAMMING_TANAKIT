const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9785;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Internet Programming Backend API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      auth: '/api/auth'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📖 API Documentation available at http://localhost:${port}`);
});

module.exports = app;
