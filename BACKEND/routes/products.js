const express = require('express');
const router = express.Router();

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    category: 'Electronics',
    rating: 4.5,
    description: 'High-quality wireless headphones with noise cancellation',
    stock: 12,
    brand: 'AudioTech',
    featured: true
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 399,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    category: 'Electronics',
    rating: 4.8,
    description: 'Advanced smartwatch with health monitoring',
    stock: 8,
    brand: 'TechWear',
    featured: true
  },
  {
    id: 3,
    name: 'iPhone 15 Pro',
    price: 999,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    category: 'Electronics',
    rating: 4.9,
    description: 'Latest iPhone with titanium design and A17 Pro chip',
    stock: 5,
    brand: 'Apple',
    featured: true
  },
  {
    id: 4,
    name: 'Gaming Laptop',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300',
    category: 'Electronics',
    rating: 4.6,
    description: 'High-performance gaming laptop with RTX 4070',
    stock: 3,
    brand: 'GameMax',
    featured: false
  },
  {
    id: 5,
    name: 'Designer T-Shirt',
    price: 89,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    category: 'Fashion',
    rating: 4.3,
    description: 'Premium cotton t-shirt with modern design',
    stock: 25,
    brand: 'StyleCo',
    featured: false
  },
  {
    id: 6,
    name: 'Denim Jacket',
    price: 149,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    category: 'Fashion',
    rating: 4.5,
    description: 'Classic denim jacket with vintage wash',
    stock: 18,
    brand: 'DenimCraft',
    featured: true
  },
  {
    id: 7,
    name: 'Coffee Maker',
    price: 199,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    category: 'Home',
    rating: 4.6,
    description: 'Automatic coffee maker for perfect brew',
    stock: 11,
    brand: 'BrewMaster',
    featured: false
  },
  {
    id: 8,
    name: 'Running Shoes',
    price: 159,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    category: 'Sports',
    rating: 4.7,
    description: 'Comfortable running shoes for daily training',
    stock: 17,
    brand: 'RunFast',
    featured: true
  }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const { category, search, featured, limit, offset } = req.query;
    
    let filteredProducts = [...mockProducts];
    
    // Filter by category
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by featured
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit: limitNum,
        offset: startIndex,
        hasMore: startIndex + limitNum < filteredProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = mockProducts.find(p => p.id === productId);
    
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
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

module.exports = router;
