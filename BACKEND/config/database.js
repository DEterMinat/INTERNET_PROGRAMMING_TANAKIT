const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ku_inventory_tanakit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Connection pool
let pool = null;

// Initialize database connection
const initDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig);
    }
    
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    if (!pool) {
      const connected = await initDB();
      if (!connected) {
        throw new Error('Database connection failed');
      }
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const connected = await initDB();
    if (connected) {
      console.log('✅ Database connection test successful');
      return true;
    } else {
      console.log('❌ Database connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Database connection test error:', error.message);
    return false;
  }
};

// Get database pool
const getPool = () => {
  return pool;
};

// Close database connection
const closeDB = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  initDB,
  executeQuery,
  testDatabaseConnection,
  getPool,
  closeDB,
  dbConfig
};
