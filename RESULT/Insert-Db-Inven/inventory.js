const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Helper function to fetch inventory from database
const fetchInventoryFromDB = async () => {
  try {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        ROUND(p.price * 0.8, 2) as cost,
        p.stock,
        5 as minStock,
        100 as maxStock,
        CONCAT(UPPER(LEFT(p.name, 3)), '-', p.id) as sku,
        CONCAT('123456789012', p.id) as barcode,
        p.brand as supplier,
        p.description,
        p.image,
        CONCAT('A-', LPAD(FLOOR((p.id-1)/10)+1, 2, '0'), '-', LPAD(((p.id-1)%10)+1, 3, '0')) as location,
        DATE_FORMAT(p.created_at, '%Y-%m-%dT%H:%i:%sZ') as lastRestocked,
        CASE WHEN p.isActive = 1 THEN 'active' ELSE 'inactive' END as status,
        '1 year' as warranty,
        ROUND(p.price * 0.2, 2) as profit,
        '20.00' as profitMargin,
        CASE 
          WHEN p.stock <= 5 THEN 'low'
          WHEN p.stock <= 10 THEN 'medium'
          ELSE 'normal'
        END as stockStatus,
        ROUND(p.price * p.stock, 2) as totalValue
      FROM products p
      WHERE p.isActive = 1
      ORDER BY p.name
    `;
    
    const result = await executeQuery(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching inventory from database:', error);
    throw error;
  }
};

// GET /api/inventory - Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, search, status, limit, offset, sortBy } = req.query;
    
    let inventory = await fetchInventoryFromDB();
    
    // Filter by category
    if (category && category !== 'All') {
      inventory = inventory.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      inventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        item.barcode.includes(search) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (status) {
      inventory = inventory.filter(item => item.status === status);
    }
    
    // Sort
    if (sortBy) {
      inventory.sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'price': return b.price - a.price;
          case 'stock': return b.stock - a.stock;
          case 'category': return a.category.localeCompare(b.category);
          default: return 0;
        }
      });
    }
    
    // Pagination
    const startIndex = parseInt(offset) || 0;
    const endIndex = limit ? startIndex + parseInt(limit) : inventory.length;
    const paginatedInventory = inventory.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedInventory,
      total: inventory.length,
      offset: startIndex,
      limit: limit ? parseInt(limit) : inventory.length
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory data',
      error: error.message
    });
  }
});

// GET /api/inventory/stats - Get inventory statistics
router.get('/stats', async (req, res) => {
  try {
    const inventory = await fetchInventoryFromDB();
    
    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: inventory.filter(item => item.stock <= item.minStock).length,
      outOfStockItems: inventory.filter(item => item.stock === 0).length,
      categories: [...new Set(inventory.map(item => item.category))].length,
      averageStockLevel: inventory.length > 0 ? 
        Math.round(inventory.reduce((sum, item) => sum + item.stock, 0) / inventory.length) : 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory statistics',
      error: error.message
    });
  }
});

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const inventory = await fetchInventoryFromDB();
    const item = inventory.find(item => item.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory item',
      error: error.message
    });
  }
});

// PUT /api/inventory/:id/stock - Update stock level
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, operation } = req.body;
    
    if (!stock || typeof stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid stock amount is required'
      });
    }
    
    // Get current stock level
    const currentQuery = `SELECT stock FROM products WHERE id = ? AND isActive = 1`;
    const currentResult = await executeQuery(currentQuery, [id]);
    
    if (!currentResult || currentResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let newStock;
    const currentStock = currentResult[0].stock;
    
    if (operation === 'add') {
      newStock = currentStock + stock;
    } else if (operation === 'subtract') {
      newStock = Math.max(0, currentStock - stock);
    } else {
      newStock = stock;
    }
    
    // Update stock in database
    const updateQuery = `UPDATE products SET stock = ? WHERE id = ?`;
    await executeQuery(updateQuery, [newStock, id]);
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        id: parseInt(id),
        previousStock: currentStock,
        newStock: newStock,
        operation: operation || 'set'
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
});

// GET /api/inventory/low-stock - Get low stock items
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const inventory = await fetchInventoryFromDB();
    const lowStockItems = inventory.filter(item => item.stock <= item.minStock);
    
    res.json({
      success: true,
      data: lowStockItems,
      count: lowStockItems.length
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items',
      error: error.message
    });
  }
});

// GET /api/inventory/categories - Get all categories
router.get('/meta/categories', async (req, res) => {
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

// POST /api/inventory - Create new inventory item (creates new product)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/inventory called with body:', JSON.stringify(req.body, null, 2));
    
    const {
      name,
      category,
      price,
      stock,
      brand,
      description,
      image,
      minStock = 5,
      maxStock = 100
    } = req.body;

    console.log('Extracted values:', { name, category, price, stock, brand });

    // Validation
    if (!name || !category || price === undefined || stock === undefined) {
      console.log('Validation failed:', { name: !!name, category: !!category, price: price !== undefined, stock: stock !== undefined });
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: name, category, price, stock'
      });
    }

    const insertQuery = `
      INSERT INTO products (
        name, category, price, stock, brand, description, image, 
        isActive, featured, rating, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, NOW(), NOW())
    `;

    console.log('About to execute query:', insertQuery);
    console.log('With values:', [name, category, parseFloat(price), parseInt(stock), brand || null, description || null, image || null]);

    const result = await executeQuery(insertQuery, [
      name,
      category,
      parseFloat(price),
      parseInt(stock),
      brand || null,
      description || null,
      image || null
    ]);

    console.log('Insert result:', result);

    if (result && result.insertId) {
      // Fetch the created item in inventory format
      const newItem = await fetchInventoryFromDB();
      const createdItem = newItem.find(item => item.id == result.insertId);
      
      console.log('Created item:', createdItem);

      res.status(201).json({
        success: true,
        message: 'เพิ่มสินค้าในคลังสำเร็จ',
        data: createdItem
      });
    } else {
      console.log('Insert failed, no insertId');
      throw new Error('Failed to create inventory item');
    }
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถเพิ่มสินค้าในคลังได้',
      error: error.message
    });
  }
});

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      stock,
      brand,
      description,
      image,
      featured
    } = req.body;

    // Check if item exists
    const checkQuery = `SELECT id FROM products WHERE id = ? AND isActive = 1`;
    const existingItem = await executeQuery(checkQuery, [id]);

    if (!existingItem || existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการแก้ไข'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }
    if (stock !== undefined) {
      updateFields.push('stock = ?');
      updateValues.push(parseInt(stock));
    }
    if (brand !== undefined) {
      updateFields.push('brand = ?');
      updateValues.push(brand);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (image !== undefined) {
      updateFields.push('image = ?');
      updateValues.push(image);
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

    // Fetch updated item in inventory format
    const inventory = await fetchInventoryFromDB();
    const updatedItem = inventory.find(item => item.id == id);

    res.json({
      success: true,
      message: 'อัพเดทสินค้าในคลังสำเร็จ',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทสินค้าในคลังได้',
      error: error.message
    });
  }
});

// DELETE /api/inventory/:id - Delete inventory item (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const checkQuery = `SELECT id, name FROM products WHERE id = ?`;
    const existingItem = await executeQuery(checkQuery, [id]);

    if (!existingItem || existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการลบ'
      });
    }

    // Hard delete - permanently remove from database
    const deleteQuery = `DELETE FROM products WHERE id = ?`;
    const result = await executeQuery(deleteQuery, [id]);

    console.log('Delete result:', result);

    res.json({
      success: true,
      message: `ลบสินค้า "${existingItem[0].name}" จากคลังสำเร็จ (ลบถาวร)`
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถลบสินค้าจากคลังได้',
      error: error.message
    });
  }
});

module.exports = router;
