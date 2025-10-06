// ============================================
// Backend Routes - Edit (Update) Functionality
// File: BACKEND/routes/inventory.js
// ============================================

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

// ============================================
// GET /api/inventory - Get all inventory items
// ============================================
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
        (item.description && item.description.toLowerCase().includes(searchLower))
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

// ============================================
// GET /api/inventory/:id - Get single inventory item
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        p.stock,
        p.brand,
        p.description,
        p.image,
        p.featured,
        p.isActive,
        DATE_FORMAT(p.created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
        DATE_FORMAT(p.updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM products p
      WHERE p.id = ? AND p.isActive = 1
    `;
    
    const result = await executeQuery(query, [id]);
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการ'
      });
    }
    
    res.json({
      success: true,
      data: result[0]
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

// ============================================
// ✏️ PUT /api/inventory/:id - Update inventory item (EDIT)
// ============================================
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

    console.log('✏️ PUT /api/inventory/:id called');
    console.log('ID:', id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Check if item exists
    const checkQuery = `SELECT id, name FROM products WHERE id = ? AND isActive = 1`;
    const existingItem = await executeQuery(checkQuery, [id]);

    if (!existingItem || existingItem.length === 0) {
      console.log('❌ Item not found:', id);
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการแก้ไข'
      });
    }

    console.log('✅ Item found:', existingItem[0].name);

    // Build update query dynamically (อัพเดทเฉพาะฟิลด์ที่ส่งมา)
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

    // Always update the updated_at timestamp
    updateFields.push('updated_at = NOW()');
    
    // Add ID to the end of values array
    updateValues.push(id);

    if (updateFields.length === 1) {
      // Only updated_at, no actual changes
      return res.status(400).json({
        success: false,
        message: 'ไม่มีข้อมูลที่ต้องการอัพเดท'
      });
    }

    const updateQuery = `
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    console.log('📝 Update query:', updateQuery);
    console.log('📝 Update values:', updateValues);

    const result = await executeQuery(updateQuery, updateValues);
    console.log('✅ Update result:', result);

    // Fetch updated item in inventory format
    const inventory = await fetchInventoryFromDB();
    const updatedItem = inventory.find(item => item.id == id);

    console.log('✅ Updated item:', updatedItem);

    res.json({
      success: true,
      message: `อัพเดทสินค้า "${existingItem[0].name}" สำเร็จ`,
      data: updatedItem
    });
  } catch (error) {
    console.error('❌ Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทสินค้าในคลังได้',
      error: error.message
    });
  }
});

// ============================================
// PUT /api/inventory/:id/stock - Update stock level only
// ============================================
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
    const updateQuery = `UPDATE products SET stock = ?, updated_at = NOW() WHERE id = ?`;
    await executeQuery(updateQuery, [newStock, id]);
    
    res.json({
      success: true,
      message: 'อัพเดทจำนวนสต็อกสำเร็จ',
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

// ============================================
// POST /api/inventory - Create new inventory item
// ============================================
router.post('/', async (req, res) => {
  try {
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

    // Validation
    if (!name || !category || price === undefined || stock === undefined) {
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

    const result = await executeQuery(insertQuery, [
      name,
      category,
      parseFloat(price),
      parseInt(stock),
      brand || null,
      description || null,
      image || null
    ]);

    if (result && result.insertId) {
      const newItem = await fetchInventoryFromDB();
      const createdItem = newItem.find(item => item.id == result.insertId);

      res.status(201).json({
        success: true,
        message: 'เพิ่มสินค้าในคลังสำเร็จ',
        data: createdItem
      });
    } else {
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

// ============================================
// DELETE /api/inventory/:id - Delete inventory item
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const checkQuery = `SELECT id, name FROM products WHERE id = ?`;
    const existingItem = await executeQuery(checkQuery, [id]);

    if (!existingItem || existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการลบ'
      });
    }

    const deleteQuery = `DELETE FROM products WHERE id = ?`;
    await executeQuery(deleteQuery, [id]);

    res.json({
      success: true,
      message: `ลบสินค้า "${existingItem[0].name}" จากคลังสำเร็จ`
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
