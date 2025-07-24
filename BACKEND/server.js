const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database configuration and models
const { testConnection, syncDatabase } = require('./config/database');
const { runSeeders } = require('./seeders');

const app = express();
const port = process.env.PORT || 9785;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes (use database versions)
// Routes will be loaded dynamically based on database connection

// Use routes (will be set dynamically)
// app.use('/api/products', productsRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/auth', authRoutes);

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

// Database initialization and server start
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (isConnected) {
      // Use database routes
      console.log('🗄️  Using database mode');
      
      // Sync database (create tables if they don't exist)
      await syncDatabase();
      
      // Run seeders to populate initial data
      await runSeeders();
      
      // Use database routes
      app.use('/api/products', require('./routes/products_db'));
      app.use('/api/users', require('./routes/users_db'));
      app.use('/api/auth', require('./routes/auth_db'));
    } else {
      // Use mock data routes
      console.log('📋 Using mock data mode');
      
      // Use original mock routes
      app.use('/api/products', require('./routes/products'));
      app.use('/api/users', require('./routes/users'));
      app.use('/api/auth', require('./routes/auth'));
    }
    
    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log(`📖 API Documentation available at http://localhost:${port}`);
      console.log(`🗄️  Database: ${isConnected ? `Connected to ${process.env.DB_NAME || 'MySQL'}` : 'Using mock data'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
