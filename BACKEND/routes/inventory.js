const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper function to read JSON files
const readJsonFile = async (filename) => {
  try {
    // Use absolute path to data directory
    const filePath = path.join(process.cwd(), 'BACKEND', 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return [];
  }
};

// Helper function to write JSON files
const writeJsonFile = async (filename, data) => {
  try {
    const filePath = path.join(process.cwd(), 'BACKEND', 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

// Helper function to fetch inventory from JSON file
const fetchInventoryFromJson = async () => {
  try {
    return await readJsonFile('inventory.json');
  } catch (error) {
    console.error('Failed to fetch from JSON file:', error);
    // Fallback to empty array if file reading fails
    return [];
  }
};

// Helper function to save inventory to JSON file
const saveInventoryToJson = async (inventory) => {
  try {
    return await writeJsonFile('inventory.json', inventory);
  } catch (error) {
    console.error('Failed to save to JSON file:', error);
    throw error;
  }
};

// GET /api/inventory - Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, search, status, limit, offset, sortBy } = req.query;
    
    let inventory = await fetchInventoryFromJson();
    
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
    
    // Add computed fields
    inventory = inventory.map(item => ({
      ...item,
      profit: item.price - item.cost,
      profitMargin: ((item.price - item.cost) / item.price * 100).toFixed(2),
      stockStatus: item.stock <= item.minStock ? 'low' : 
                   item.stock >= item.maxStock ? 'full' : 'normal',
      totalValue: item.stock * item.cost
    }));
    
    // Sort inventory
    if (sortBy) {
      inventory.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return b.price - a.price;
          case 'stock':
            return b.stock - a.stock;
          case 'lastRestocked':
            return new Date(b.lastRestocked) - new Date(a.lastRestocked);
          default:
            return 0;
        }
      });
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || inventory.length;
    const paginatedInventory = inventory.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedInventory,
      pagination: {
        total: inventory.length,
        limit: limitNum,
        offset: startIndex,
        hasMore: startIndex + limitNum < inventory.length
      },
      summary: {
        totalItems: inventory.length,
        totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
        lowStockItems: inventory.filter(item => item.stockStatus === 'low').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory',
      message: error.message
    });
  }
});

// GET /api/inventory/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const inventory = await fetchInventoryFromJson();
    const categories = [...new Set(inventory.map(item => item.category))];
    
    res.json({
      success: true,
      data: categories.map(category => ({
        name: category,
        count: inventory.filter(item => item.category === category).length
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/inventory/stats - Get inventory statistics
router.get('/stats', async (req, res) => {
  try {
    const inventory = await fetchInventoryFromJson();
    
    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0),
      totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
      lowStockItems: inventory.filter(item => item.stock <= item.minStock).length,
      outOfStockItems: inventory.filter(item => item.stock === 0).length,
      categoriesCount: [...new Set(inventory.map(item => item.category))].length,
      averagePrice: inventory.reduce((sum, item) => sum + item.price, 0) / inventory.length,
      topCategories: Object.entries(
        inventory.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory stats',
      message: error.message
    });
  }
});

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const inventory = await fetchInventoryFromJson();
    const item = inventory.find(p => p.id === itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `Inventory item with ID ${itemId} does not exist`
      });
    }
    
    // Add computed fields
    const enhancedItem = {
      ...item,
      profit: item.price - item.cost,
      profitMargin: ((item.price - item.cost) / item.price * 100).toFixed(2),
      stockStatus: item.stock <= item.minStock ? 'low' : 
                   item.stock >= item.maxStock ? 'full' : 'normal',
      totalValue: item.stock * item.cost
    };
    
    res.json({
      success: true,
      data: enhancedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory item',
      message: error.message
    });
  }
});

// POST /api/inventory - Create new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, sku, description, category, price, cost, stock, minStock, maxStock, barcode, location, tags } = req.body;
    
    // Validation
    if (!name || !sku || !category || price == null || cost == null || stock == null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'name, sku, category, price, cost, and stock are required'
      });
    }
    
    const inventory = await fetchInventoryFromJson();
    
    // Check for duplicate SKU
    const existingSku = inventory.find(item => item.sku === sku);
    if (existingSku) {
      return res.status(400).json({
        success: false,
        error: 'SKU already exists',
        message: `Item with SKU ${sku} already exists`
      });
    }
    
    // Generate new ID
    const newId = Math.max(...inventory.map(item => item.id)) + 1;
    
    const newItem = {
      id: newId,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      description: description || '',
      category: category.trim(),
      price: parseFloat(price),
      cost: parseFloat(cost),
      stock: parseInt(stock),
      minStock: parseInt(minStock) || 10,
      maxStock: parseInt(maxStock) || 1000,
      barcode: barcode || '',
      location: location || '',
      status: parseInt(stock) > 0 ? 'active' : 'out_of_stock',
      lastRestocked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || []
    };
    
    inventory.push(newItem);
    await saveInventoryToJson(inventory);
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Inventory item created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create inventory item',
      message: error.message
    });
  }
});

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const updates = req.body;
    
    const inventory = await fetchInventoryFromJson();
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `Inventory item with ID ${itemId} does not exist`
      });
    }
    
    // If updating SKU, check for duplicates
    if (updates.sku && updates.sku !== inventory[itemIndex].sku) {
      const existingSku = inventory.find(item => item.sku === updates.sku && item.id !== itemId);
      if (existingSku) {
        return res.status(400).json({
          success: false,
          error: 'SKU already exists',
          message: `Item with SKU ${updates.sku} already exists`
        });
      }
    }
    
    // Update the item
    const updatedItem = {
      ...inventory[itemIndex],
      ...updates,
      id: itemId, // Prevent ID changes
      updatedAt: new Date().toISOString()
    };
    
    // Update status based on stock
    if (updates.stock != null) {
      updatedItem.status = parseInt(updates.stock) > 0 ? 'active' : 'out_of_stock';
    }
    
    inventory[itemIndex] = updatedItem;
    await saveInventoryToJson(inventory);
    
    res.json({
      success: true,
      data: updatedItem,
      message: 'Inventory item updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update inventory item',
      message: error.message
    });
  }
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const inventory = await fetchInventoryFromJson();
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `Inventory item with ID ${itemId} does not exist`
      });
    }
    
    const deletedItem = inventory.splice(itemIndex, 1)[0];
    await saveInventoryToJson(inventory);
    
    res.json({
      success: true,
      data: deletedItem,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete inventory item',
      message: error.message
    });
  }
});

// POST /api/inventory/:id/restock - Restock inventory item
router.post('/:id/restock', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { quantity, note } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be a positive number'
      });
    }
    
    const inventory = await fetchInventoryFromJson();
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `Inventory item with ID ${itemId} does not exist`
      });
    }
    
    const item = inventory[itemIndex];
    const oldStock = item.stock;
    const newStock = oldStock + parseInt(quantity);
    
    // Update the item
    inventory[itemIndex] = {
      ...item,
      stock: newStock,
      status: newStock > 0 ? 'active' : 'out_of_stock',
      lastRestocked: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await saveInventoryToJson(inventory);
    
    res.json({
      success: true,
      data: inventory[itemIndex],
      message: `Successfully restocked ${quantity} units. Stock updated from ${oldStock} to ${newStock}`,
      restockInfo: {
        previousStock: oldStock,
        restockedQuantity: parseInt(quantity),
        newStock: newStock,
        note: note || null,
        restockedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to restock inventory item',
      message: error.message
    });
  }
});

module.exports = router;
