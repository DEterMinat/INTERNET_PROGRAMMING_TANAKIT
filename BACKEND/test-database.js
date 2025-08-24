#!/usr/bin/env node

// Database connection test
require('dotenv').config();
const { testDatabaseConnection, executeQuery, closeDB } = require('./config/database');

async function testDatabase() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const connected = await testDatabaseConnection();
    
    if (!connected) {
      console.log('❌ Basic connection failed');
      process.exit(1);
    }
    
    // Test query execution
    console.log('2. Testing query execution...');
    const result = await executeQuery('SELECT 1 as test_value');
    console.log('✅ Query test result:', result);
    
    // Test database and table existence
    console.log('3. Checking database and tables...');
    
    // Check if products table exists
    const tables = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
    `, [process.env.DB_NAME]);
    
    if (tables.length > 0) {
      console.log('✅ Products table exists');
      
      // Count products
      const productCount = await executeQuery('SELECT COUNT(*) as count FROM products');
      console.log(`📊 Products in database: ${productCount[0].count}`);
    } else {
      console.log('⚠️  Products table not found');
    }
    
    // Check if users table exists
    const userTables = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME]);
    
    if (userTables.length > 0) {
      console.log('✅ Users table exists');
      
      // Count users
      const userCount = await executeQuery('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Users in database: ${userCount[0].count}`);
    } else {
      console.log('⚠️  Users table not found');
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Run the test
if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;
