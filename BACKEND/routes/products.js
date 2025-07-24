const express = require('express');
const router = express.Router();

// Mock products data - same as frontend
const mockProducts = [
  // Electronics
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
    name: 'Bluetooth Speaker',
    price: 159,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    category: 'Electronics',
    rating: 4.4,
    description: 'Portable waterproof Bluetooth speaker',
    stock: 15,
    brand: 'SoundWave',
    featured: false
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 79,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
    category: 'Electronics',
    rating: 4.3,
    description: 'Ergonomic wireless gaming mouse',
    stock: 20,
    brand: 'GamerPro',
    featured: false
  },

  // Fashion
  {
    id: 7,
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
    id: 8,
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
    id: 9,
    name: 'Summer Dress',
    price: 119,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
    category: 'Fashion',
    rating: 4.7,
    description: 'Flowy summer dress perfect for any occasion',
    stock: 14,
    brand: 'ElegantWear',
    featured: true
  },
  {
    id: 10,
    name: 'Leather Boots',
    price: 229,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    category: 'Fashion',
    rating: 4.8,
    description: 'Handcrafted genuine leather boots',
    stock: 10,
    brand: 'LeatherMaster',
    featured: false
  },
  {
    id: 11,
    name: 'Designer Handbag',
    price: 349,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300',
    category: 'Fashion',
    rating: 4.6,
    description: 'Elegant designer handbag with premium materials',
    stock: 7,
    brand: 'LuxuryBags',
    featured: true
  },
  {
    id: 12,
    name: 'Sunglasses',
    price: 189,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300',
    category: 'Fashion',
    rating: 4.4,
    description: 'UV protection sunglasses with polarized lenses',
    stock: 22,
    brand: 'SunStyle',
    featured: false
  },

  // Home
  {
    id: 13,
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
    id: 14,
    name: 'Air Purifier',
    price: 299,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
    category: 'Home',
    rating: 4.7,
    description: 'HEPA air purifier for cleaner indoor air',
    stock: 9,
    brand: 'CleanAir',
    featured: true
  },
  {
    id: 15,
    name: 'Smart Thermostat',
    price: 249,
    image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa1?w=300',
    category: 'Home',
    rating: 4.5,
    description: 'WiFi-enabled smart thermostat with scheduling',
    stock: 6,
    brand: 'SmartHome',
    featured: false
  },
  {
    id: 16,
    name: 'LED Desk Lamp',
    price: 89,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    category: 'Home',
    rating: 4.3,
    description: 'Adjustable LED desk lamp with USB charging',
    stock: 16,
    brand: 'BrightLight',
    featured: false
  },
  {
    id: 17,
    name: 'Throw Pillows Set',
    price: 69,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
    category: 'Home',
    rating: 4.4,
    description: 'Set of 4 decorative throw pillows',
    stock: 30,
    brand: 'ComfortHome',
    featured: false
  },
  {
    id: 18,
    name: 'Kitchen Scale',
    price: 49,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    category: 'Home',
    rating: 4.2,
    description: 'Digital kitchen scale with precision weighing',
    stock: 24,
    brand: 'PrecisionCook',
    featured: false
  },

  // Books
  {
    id: 19,
    name: 'Programming Book',
    price: 49,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300',
    category: 'Books',
    rating: 4.4,
    description: 'Learn modern programming techniques',
    stock: 35,
    brand: 'TechBooks',
    featured: false
  },
  {
    id: 20,
    name: 'Design Thinking',
    price: 39,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
    category: 'Books',
    rating: 4.6,
    description: 'A comprehensive guide to design thinking process',
    stock: 28,
    brand: 'CreativePress',
    featured: false
  },
  {
    id: 21,
    name: 'Business Strategy',
    price: 59,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    category: 'Books',
    rating: 4.5,
    description: 'Strategic business planning and execution',
    stock: 19,
    brand: 'BusinessPro',
    featured: false
  },
  {
    id: 22,
    name: 'Data Science Handbook',
    price: 79,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300',
    category: 'Books',
    rating: 4.7,
    description: 'Complete guide to data science and analytics',
    stock: 13,
    brand: 'DataPress',
    featured: true
  },
  {
    id: 23,
    name: 'Photography Guide',
    price: 45,
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300',
    category: 'Books',
    rating: 4.3,
    description: 'Master the art of digital photography',
    stock: 21,
    brand: 'PhotoBooks',
    featured: false
  },
  {
    id: 24,
    name: 'Cooking Essentials',
    price: 35,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300',
    category: 'Books',
    rating: 4.5,
    description: 'Essential cooking techniques and recipes',
    stock: 26,
    brand: 'CulinaryPress',
    featured: false
  },

  // Sports
  {
    id: 25,
    name: 'Running Shoes',
    price: 159,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    category: 'Sports',
    rating: 4.7,
    description: 'Comfortable running shoes for daily training',
    stock: 17,
    brand: 'RunFast',
    featured: true
  },
  {
    id: 26,
    name: 'Yoga Mat',
    price: 49,
    image: 'https://images.unsplash.com/photo-1506629905607-d8d2e78940bb?w=300',
    category: 'Sports',
    rating: 4.5,
    description: 'Non-slip yoga mat with carrying strap',
    stock: 33,
    brand: 'YogaLife',
    featured: false
  },
  {
    id: 27,
    name: 'Dumbbells Set',
    price: 199,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    category: 'Sports',
    rating: 4.6,
    description: 'Adjustable dumbbells for home workouts',
    stock: 8,
    brand: 'FitGear',
    featured: false
  },
  {
    id: 28,
    name: 'Tennis Racket',
    price: 129,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300',
    category: 'Sports',
    rating: 4.4,
    description: 'Professional tennis racket with graphite frame',
    stock: 12,
    brand: 'TennisPro',
    featured: false
  },
  {
    id: 29,
    name: 'Swimming Goggles',
    price: 29,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300',
    category: 'Sports',
    rating: 4.3,
    description: 'Anti-fog swimming goggles with UV protection',
    stock: 40,
    brand: 'AquaGear',
    featured: false
  },
  {
    id: 30,
    name: 'Basketball',
    price: 39,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300',
    category: 'Sports',
    rating: 4.2,
    description: 'Official size basketball with superior grip',
    stock: 23,
    brand: 'SportMax',
    featured: false
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

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const products = mockProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category',
      message: error.message
    });
  }
});

// GET /api/products/featured/list - Get featured products
router.get('/featured/list', (req, res) => {
  try {
    const featuredProducts = mockProducts.filter(product => product.featured);
    
    res.json({
      success: true,
      data: featuredProducts,
      count: featuredProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

module.exports = router;
