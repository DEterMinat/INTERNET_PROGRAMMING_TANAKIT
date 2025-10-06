// ============================================
// Backend Routes - Delete & Search
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
// GET /api/inventory - Get all inventory items with SEARCH
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
    
    // 🔍 SEARCH FUNCTIONALITY - Filter by search query
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
// DELETE /api/inventory/:id - Delete inventory item (HARD DELETE)
// ============================================
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

    // 🗑️ Hard delete - permanently remove from database
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

// ============================================
// Optional: Soft Delete (เก็บข้อมูลไว้ในฐานข้อมูล)
// ============================================
router.delete('/:id/soft', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const checkQuery = `SELECT id, name FROM products WHERE id = ? AND isActive = 1`;
    const existingItem = await executeQuery(checkQuery, [id]);

    if (!existingItem || existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการลบ'
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
      message: `ลบสินค้า "${existingItem[0].name}" จากคลังสำเร็จ (Soft Delete)`
    });
  } catch (error) {
    console.error('Error soft deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถลบสินค้าจากคลังได้',
      error: error.message
    });
  }
});

module.exports = router;
