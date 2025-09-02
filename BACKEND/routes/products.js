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

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      category,
      rating = 0,
      description,
      stock,
      brand,
      featured = false
    } = req.body;

    // Validation
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: name, price, category, stock'
      });
    }

    const insertQuery = `
      INSERT INTO products (
        name, price, image, category, rating, description, 
        stock, brand, featured, isActive, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;

    const result = await executeQuery(insertQuery, [
      name,
      parseFloat(price),
      image || null,
      category,
      parseFloat(rating),
      description || null,
      parseInt(stock),
      brand || null,
      featured ? 1 : 0
    ]);

    if (result && result.insertId) {
      // Fetch the created product
      const selectQuery = `SELECT * FROM products WHERE id = ?`;
      const newProduct = await executeQuery(selectQuery, [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'สร้างผลิตภัณฑ์สำเร็จ',
        data: newProduct[0]
      });
    } else {
      throw new Error('Failed to insert product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถสร้างผลิตภัณฑ์ได้',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      image,
      category,
      rating,
      description,
      stock,
      brand,
      featured
    } = req.body;

    // Check if product exists
    const checkQuery = `SELECT id FROM products WHERE id = ? AND isActive = 1`;
    const existingProduct = await executeQuery(checkQuery, [id]);

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผลิตภัณฑ์ที่ต้องการแก้ไข'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }
    if (image !== undefined) {
      updateFields.push('image = ?');
      updateValues.push(image);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(parseFloat(rating));
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (stock !== undefined) {
      updateFields.push('stock = ?');
      updateValues.push(parseInt(stock));
    }
    if (brand !== undefined) {
      updateFields.push('brand = ?');
      updateValues.push(brand);
    }
    if (featured !== undefined) {
      updateFields.push('featured = ?');
      updateValues.push(featured ? 1 : 0);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    const updateQuery = `
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await executeQuery(updateQuery, updateValues);

    // Fetch updated product
    const selectQuery = `SELECT * FROM products WHERE id = ?`;
    const updatedProduct = await executeQuery(selectQuery, [id]);

    res.json({
      success: true,
      message: 'อัพเดทผลิตภัณฑ์สำเร็จ',
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทผลิตภัณฑ์ได้',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const checkQuery = `SELECT id, name FROM products WHERE id = ? AND isActive = 1`;
    const existingProduct = await executeQuery(checkQuery, [id]);

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผลิตภัณฑ์ที่ต้องการลบ'
      });
    }

    // Soft delete - set isActive to 0
    const deleteQuery = `
      UPDATE products 
      SET isActive = 0, updated_at = NOW() 
      WHERE id = ?
    `;

    await executeQuery(deleteQuery, [id]);

    res.json({
      success: true,
      message: `ลบผลิตภัณฑ์ "${existingProduct[0].name}" สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถลบผลิตภัณฑ์ได้',
      error: error.message
    });
  }
});

module.exports = router;
