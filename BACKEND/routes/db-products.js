const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database connection
let pool = null;

// Initialize database connection
const initDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ku_inventory_tanakit',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      });
    }
    
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Validate database connection
const validateDB = async () => {
  const connected = await initDB();
  if (!connected) {
    throw new Error('Database connection required but unavailable');
  }
  return true;
};

// GET /api/db-products - Get all products with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      featured,
      isActive = '1',
      minPrice,
      maxPrice,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    await validateDB();

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (category) {
      whereClause += ' AND category = ?';
      queryParams.push(category);
    }
    if (brand) {
      whereClause += ' AND brand = ?';
      queryParams.push(brand);
    }
    if (featured !== undefined) {
      whereClause += ' AND featured = ?';
      queryParams.push(featured);
    }
    if (isActive !== undefined) {
      whereClause += ' AND isActive = ?';
      queryParams.push(isActive);
    }
    if (minPrice) {
      whereClause += ' AND price >= ?';
      queryParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      whereClause += ' AND price <= ?';
      queryParams.push(parseFloat(maxPrice));
    }
    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    // Validate sort parameters
    const validSortColumns = ['id', 'name', 'price', 'category', 'brand', 'stock', 'rating', 'featured', 'created_at', 'updated_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const orderByColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const orderByDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Count total records
    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;

    // Get products with pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataQuery = `
      SELECT * FROM products 
      ${whereClause}
      ORDER BY ${orderByColumn} ${orderByDirection}
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(dataQuery, [...queryParams, parseInt(limit), offset]);
    const products = rows;
    
    console.log('📊 Data fetched from MySQL database');

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasMore = parseInt(page) < totalPages;

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasMore,
        hasPrevious: parseInt(page) > 1
      },
      filters: {
        category,
        brand,
        featured,
        isActive,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder
      },
      source: 'database'
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products from database',
      error: error.message
    });
  }
});

// GET /api/db-products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    await validateDB();

    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await pool.execute(query, [parseInt(id)]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      source: 'database'
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product from database',
      error: error.message
    });
  }
});

// GET /api/db-products/statistics - Get product statistics
router.get('/statistics', async (req, res) => {
  try {
    await validateDB();

    const queries = {
      total: 'SELECT COUNT(*) as count FROM products WHERE isActive = 1',
      categories: 'SELECT COUNT(DISTINCT category) as count FROM products WHERE isActive = 1',
      brands: 'SELECT COUNT(DISTINCT brand) as count FROM products WHERE isActive = 1',
      featured: 'SELECT COUNT(*) as count FROM products WHERE featured = 1 AND isActive = 1',
      lowStock: 'SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND isActive = 1',
      totalValue: 'SELECT SUM(price * stock) as value FROM products WHERE isActive = 1',
      avgPrice: 'SELECT AVG(price) as avg FROM products WHERE isActive = 1',
      totalStock: 'SELECT SUM(stock) as total FROM products WHERE isActive = 1'
    };

    const results = await Promise.all([
      pool.execute(queries.total),
      pool.execute(queries.categories),
      pool.execute(queries.brands),
      pool.execute(queries.featured),
      pool.execute(queries.lowStock),
      pool.execute(queries.totalValue),
      pool.execute(queries.avgPrice),
      pool.execute(queries.totalStock)
    ]);

    const statistics = {
      totalProducts: results[0][0][0].count,
      totalCategories: results[1][0][0].count,
      totalBrands: results[2][0][0].count,
      featuredProducts: results[3][0][0].count,
      lowStockProducts: results[4][0][0].count,
      totalInventoryValue: parseFloat(results[5][0][0].value || 0).toFixed(2),
      averagePrice: parseFloat(results[6][0][0].avg || 0).toFixed(2),
      totalStock: results[7][0][0].total || 0
    };

    res.json({
      success: true,
      data: statistics,
      source: 'database'
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics from database',
      error: error.message
    });
  }
});

// GET /api/db-products/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    await validateDB();

    const query = 'SELECT DISTINCT category FROM products WHERE isActive = 1 ORDER BY category';
    const [rows] = await pool.execute(query);
    
    const categories = rows.map(row => row.category);

    res.json({
      success: true,
      data: categories,
      count: categories.length,
      source: 'database'
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories from database',
      error: error.message
    });
  }
});

// GET /api/db-products/brands - Get all unique brands
router.get('/brands', async (req, res) => {
  try {
    await validateDB();

    const query = 'SELECT DISTINCT brand FROM products WHERE isActive = 1 ORDER BY brand';
    const [rows] = await pool.execute(query);
    
    const brands = rows.map(row => row.brand);

    res.json({
      success: true,
      data: brands,
      count: brands.length,
      source: 'database'
    });

  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands from database',
      error: error.message
    });
  }
});

// GET /api/db-products/health - Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbConnected = await initDB();
    
    res.json({
      success: true,
      database: {
        connected: dbConnected,
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'ku_inventory_tanakit'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: {
        connected: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
