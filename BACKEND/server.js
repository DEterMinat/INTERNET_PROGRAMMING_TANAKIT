const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9785;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:30019',
    'http://localhost:8081',
    'http://119.59.102.61:3000',
    'http://nindam.sytes.net',
    'http://nindam.sytes.net:8081',
    process.env.CORS_ORIGIN
  ].filter(Boolean), // Remove any undefined values
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/json', require('./routes/json'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Internet Programming Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: {
        products: '/api/products',
        inventory: '/api/inventory',
        users: '/api/users',
        auth: '/api/auth',
        dashboard: '/api/dashboard'
      },
      json: {
        products: '/json/products.json',
        inventory: '/json/inventory.json', 
        categories: '/json/categories.json',
        dashboard: '/json/dashboard.json',
        mockData: '/json/mock-data.json'
      }
    },
    documentation: 'Visit /api-docs for detailed API documentation'
  });
});

// Health check
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

// Error handling
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
  console.log(`🗄️  Database: Using mock data`);
});

module.exports = app;
