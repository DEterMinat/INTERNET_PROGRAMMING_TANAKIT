const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Helper function to fetch products from database
const fetchProductsFromDB = async (limit = null, offset = 0) => {
  try {
    let query = `
      SELECT 
        id,
        name,
        price,
        image,
        category,
        rating,
        description,
        stock,
        brand,
        featured,
        isActive,
        created_at,
        updated_at
      FROM products 
      WHERE isActive = 1
      ORDER BY featured DESC, name ASC
    `;
    
    if (limit) {
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    const result = await executeQuery(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching products from database:', error);
    throw error;
  }
};

// GET /api/products - Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      featured, 
      limit, 
      offset,
      sortBy,
      sortOrder 
    } = req.query;
    
    let products = await fetchProductsFromDB();
    
    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range
    if (minPrice) {
      products = products.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(product => product.price <= parseFloat(maxPrice));
    }
    
    // Filter by featured
    if (featured === 'true') {
      products = products.filter(product => product.featured);
    }
    
    // Sort products
    if (sortBy) {
      products.sort((a, b) => {
        const order = sortOrder === 'desc' ? -1 : 1;
        switch (sortBy) {
          case 'price':
            return order * (a.price - b.price);
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'rating':
            return order * (a.rating - b.rating);
          case 'stock':
            return order * (a.stock - b.stock);
          default:
            return 0;
        }
      });
    }
    
    // Pagination
    const startIndex = parseInt(offset) || 0;
    const endIndex = limit ? startIndex + parseInt(limit) : products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedProducts,
      total: products.length,
      offset: startIndex,
      limit: limit ? parseInt(limit) : products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, name, price, image, category, rating, description, stock, brand, featured
      FROM products 
      WHERE isActive = 1 AND featured = 1
      ORDER BY name
      LIMIT 10
    `;
    
    const featuredProducts = await executeQuery(query);
    
    res.json({
      success: true,
      data: featuredProducts || []
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// GET /api/products/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const query = `SELECT DISTINCT category FROM products WHERE isActive = 1 ORDER BY category`;
    const result = await executeQuery(query);
    
    const categories = result ? result.map(row => row.category) : [];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        id, name, price, image, category, rating, description, stock, brand, featured, isActive, created_at, updated_at
      FROM products 
      WHERE id = ? AND isActive = 1
    `;
    
    const result = await executeQuery(query, [id]);
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// GET /api/products/search/:query - Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = `
      SELECT 
        id, name, price, image, category, rating, description, stock, brand, featured
      FROM products 
      WHERE isActive = 1 
      AND (
        name LIKE ? OR 
        description LIKE ? OR 
        brand LIKE ? OR 
        category LIKE ?
      )
      ORDER BY name
      LIMIT 20
    `;
    
    const searchTerm = `%${query}%`;
    const result = await executeQuery(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm]);
    
    res.json({
      success: true,
      data: result || [],
      query: query
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
});

module.exports = router;
