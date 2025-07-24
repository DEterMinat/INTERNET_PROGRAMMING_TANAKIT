const express = require('express');
const { Op } = require('sequelize');
const { Product } = require('../models');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit = 50, offset = 0 } = req.query;
    
    // Build where conditions
    const whereConditions = {
      isActive: true
    };
    
    // Filter by category
    if (category && category !== 'All') {
      whereConditions.category = {
        [Op.iLike]: `%${category}%`
      };
    }
    
    // Filter by search query
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filter by featured
    if (featured === 'true') {
      whereConditions.featured = true;
    }
    
    // Get products with pagination
    const products = await Product.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: products.rows,
      pagination: {
        total: products.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < products.count
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a number'
      });
    }
    
    const product = await Product.findOne({
      where: {
        id: productId,
        isActive: true
      }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${productId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const products = await Product.findAndCountAll({
      where: {
        category: {
          [Op.iLike]: `%${category}%`
        },
        isActive: true
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: products.rows,
      pagination: {
        total: products.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < products.count
      }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category',
      message: error.message
    });
  }
});

// GET /api/products/featured/list - Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.findAll({
      where: {
        featured: true,
        isActive: true
      },
      limit: parseInt(limit),
      order: [['rating', 'DESC'], ['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

// POST /api/products - Create new product (Admin only)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock = 0,
      rating = 0,
      featured = false
    } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, price, and category are required'
      });
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating,
      featured
    });
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a number'
      });
    }
    
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${productId} does not exist`
      });
    }
    
    const updatedProduct = await product.update(req.body);
    
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a number'
      });
    }
    
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${productId} does not exist`
      });
    }
    
    // Soft delete by setting isActive to false
    await product.update({ isActive: false });
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

module.exports = router;
