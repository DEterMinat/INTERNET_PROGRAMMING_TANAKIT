const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9785;

// Database connection
let pool = null;

// Initialize database connection
const initDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ku_inventory_tanakit',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Export database pool for routes
global.dbPool = pool;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:30019',
    'http://localhost:8081',
    'http://119.59.102.61:3000',
    'http://119.59.102.61:30019',
    'http://119.59.102.61:8081',
    'http://nindam.sytes.net',
    'http://nindam.sytes.net:8081',
    'http://nindam.sytes.net:30019',
    process.env.CORS_ORIGIN
  ].filter(Boolean), // Remove any undefined values
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes (remove duplicates)
app.use('/api/products', require('./routes/products'));
app.use('/api/db-products', require('./routes/db-products'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/final-inventory', require('./routes/final-inventory'));
app.use('/api/upload', require('./routes/upload'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Internet Programming Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: '/api/db-products',
      inventory: '/api/inventory',
      users: '/api/users',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    },
    database: 'MySQL',
    documentation: 'Visit /api-docs for detailed API documentation'
  });
});

// Health check with database status
app.get('/health', async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    if (pool) {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      dbStatus = 'connected';
    }
    
    res.status(200).json({
      status: 'OK',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(200).json({
      status: 'OK',
      database: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: error.message
    });
  }
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

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database connection
    const dbConnected = await initDatabase();
    
    // Start Express server with specific IP binding
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://119.59.102.61:${port}`);
      console.log(`📖 API Documentation available at http://119.59.102.61:${port}`);
      console.log(`🔗 Example API: http://119.59.102.61:${port}/api/inventory`);
      console.log(`🔗 Products API: http://119.59.102.61:${port}/api/db-products`);
      console.log(`🔗 Health Check: http://119.59.102.61:${port}/health`);
      console.log(`🗄️  Database: ${dbConnected ? 'MySQL Connected' : 'MySQL Connection Failed'}`);
      
      if (!dbConnected) {
        console.warn('⚠️  Server started without database connection');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

module.exports = app;
