const express = require('express');
const router = express.Router();

// JSON Data สำหรับ Frontend
const getInventoryJSON = () => [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    price: 43900,
    cost: 35000,
    stock: 25,
    minStock: 5,
    maxStock: 100,
    sku: "IP15PM-256-TB",
    barcode: "1234567890123",
    supplier: "Apple Thailand",
    description: "iPhone 15 Pro Max 256GB Titanium Blue พร้อม USB-C และ Action Button",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    location: "A-01-001",
    lastRestocked: "2024-12-01T10:00:00Z",
    status: "active",
    warranty: "1 year",
    profit: 8900,
    profitMargin: "20.27",
    stockStatus: "normal",
    totalValue: 875000
  },
  {
    id: 2,
    name: "MacBook Air M3",
    category: "Electronics", 
    price: 42900,
    cost: 34000,
    stock: 15,
    minStock: 3,
    maxStock: 50,
    sku: "MBA-M3-13-MN",
    barcode: "2345678901234",
    supplier: "Apple Thailand",
    description: "MacBook Air 13-inch M3 chip 256GB SSD Midnight",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    location: "A-01-002",
    lastRestocked: "2024-11-28T14:30:00Z",
    status: "active",
    warranty: "1 year",
    profit: 8900,
    profitMargin: "20.75",
    stockStatus: "normal",
    totalValue: 510000
  },
  {
    id: 3,
    name: "AirPods Pro (3rd Gen)",
    category: "Electronics",
    price: 8900,
    cost: 6500,
    stock: 50,
    minStock: 10,
    maxStock: 200,
    sku: "APP3-USB-C",
    barcode: "3456789012345",
    supplier: "Apple Thailand", 
    description: "AirPods Pro (3rd generation) with USB-C charging case",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    location: "B-02-001",
    lastRestocked: "2024-12-02T09:15:00Z",
    status: "active",
    warranty: "1 year",
    profit: 2400,
    profitMargin: "26.97",
    stockStatus: "normal",
    totalValue: 325000
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    price: 44900,
    cost: 36000,
    stock: 18,
    minStock: 5,
    maxStock: 50,
    sku: "SGS24U-512-TB",
    barcode: "4567890123456",
    supplier: "Samsung Thailand",
    description: "Samsung Galaxy S24 Ultra 512GB Titanium Black with S Pen",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    location: "A-01-003",
    lastRestocked: "2024-11-30T08:45:00Z",
    status: "active",
    warranty: "1 year",
    profit: 8900,
    profitMargin: "19.82",
    stockStatus: "normal",
    totalValue: 648000
  },
  {
    id: 5,
    name: "Dell XPS 13",
    category: "Computers",
    price: 38900,
    cost: 31000,
    stock: 8,
    minStock: 3,
    maxStock: 25,
    sku: "DXPS13-512-SL",
    barcode: "5678901234567",
    supplier: "Dell Thailand",
    description: "Dell XPS 13 Intel Core i7 512GB SSD Silver",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    location: "A-02-001",
    lastRestocked: "2024-11-25T16:20:00Z",
    status: "active",
    warranty: "2 years",
    profit: 7900,
    profitMargin: "20.31",
    stockStatus: "normal",
    totalValue: 248000
  },
  {
    id: 6,
    name: "iPad Pro 12.9",
    category: "Tablets",
    price: 35900,
    cost: 28000,
    stock: 12,
    minStock: 4,
    maxStock: 30,
    sku: "IPP129-256-SG",
    barcode: "6789012345678",
    supplier: "Apple Thailand",
    description: "iPad Pro 12.9-inch M2 chip 256GB Space Gray",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    location: "B-01-001",
    lastRestocked: "2024-12-03T11:30:00Z",
    status: "active",
    warranty: "1 year",
    profit: 7900,
    profitMargin: "22.01",
    stockStatus: "normal",
    totalValue: 336000
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 12900,
    cost: 9500,
    stock: 25,
    minStock: 8,
    maxStock: 100,
    sku: "SWXM5-BK",
    barcode: "7890123456789",
    supplier: "Sony Thailand",
    description: "Sony WH-1000XM5 Wireless Noise Canceling Headphones Black",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    location: "C-01-001",
    lastRestocked: "2024-11-29T14:15:00Z",
    status: "active",
    warranty: "1 year",
    profit: 3400,
    profitMargin: "26.36",
    stockStatus: "normal",
    totalValue: 237500
  },
  {
    id: 8,
    name: "Apple Watch Series 9",
    category: "Wearables",
    price: 13900,
    cost: 10500,
    stock: 30,
    minStock: 10,
    maxStock: 80,
    sku: "AWS9-45-MN",
    barcode: "8901234567890",
    supplier: "Apple Thailand",
    description: "Apple Watch Series 9 45mm Midnight Aluminum with Sport Band",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    location: "B-03-001",
    lastRestocked: "2024-12-01T09:45:00Z",
    status: "active",
    warranty: "1 year",
    profit: 3400,
    profitMargin: "24.46",
    stockStatus: "normal",
    totalValue: 315000
  },
  {
    id: 9,
    name: "Nintendo Switch OLED",
    category: "Gaming",
    price: 12500,
    cost: 9800,
    stock: 5,
    minStock: 8,
    maxStock: 40,
    sku: "NSW-OLED-WH",
    barcode: "9012345678901",
    supplier: "Nintendo Thailand",
    description: "Nintendo Switch OLED Model White with enhanced display",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    location: "D-01-001",
    lastRestocked: "2024-11-20T13:00:00Z",
    status: "active",
    warranty: "1 year",
    profit: 2700,
    profitMargin: "21.60",
    stockStatus: "low",
    totalValue: 49000
  },
  {
    id: 10,
    name: "Canon EOS R6 Mark II",
    category: "Cameras",
    price: 75900,
    cost: 62000,
    stock: 6,
    minStock: 3,
    maxStock: 15,
    sku: "CER6M2-BODY",
    barcode: "0123456789012",
    supplier: "Canon Thailand",
    description: "Canon EOS R6 Mark II Mirrorless Camera Body Only",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    location: "E-01-001",
    lastRestocked: "2024-11-15T10:30:00Z",
    status: "active",
    warranty: "2 years",
    profit: 13900,
    profitMargin: "18.31",
    stockStatus: "normal",
    totalValue: 372000
  }
];

const getProductsJSON = () => [
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
    name: 'Laptop Bag',
    price: 89,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    category: 'Accessories',
    rating: 4.2,
    description: 'Durable laptop bag with multiple compartments',
    stock: 25,
    brand: 'CarryOn',
    featured: false
  }
];

const getCategoriesJSON = () => [
  { id: 1, name: 'Electronics', count: 156, icon: '📱' },
  { id: 2, name: 'Computers', count: 89, icon: '💻' },
  { id: 3, name: 'Tablets', count: 45, icon: '📱' },
  { id: 4, name: 'Audio', count: 67, icon: '🎧' },
  { id: 5, name: 'Wearables', count: 34, icon: '⌚' },
  { id: 6, name: 'Gaming', count: 78, icon: '🎮' },
  { id: 7, name: 'Cameras', count: 23, icon: '📷' },
  { id: 8, name: 'Accessories', count: 145, icon: '🔌' }
];

const getDashboardJSON = () => ({
  overview: {
    totalRevenue: 2450000,
    totalOrders: 1580,
    totalProducts: 637,
    totalCustomers: 2890,
    monthlyGrowth: 12.5,
    weeklyGrowth: 3.2
  },
  recentSales: [
    { id: 1, product: 'iPhone 15 Pro Max', amount: 43900, customer: 'นายสมชาย ใจดี', date: '2024-12-03T10:30:00Z' },
    { id: 2, product: 'MacBook Air M3', amount: 42900, customer: 'นางสาวใจ ดี', date: '2024-12-03T09:15:00Z' },
    { id: 3, product: 'Samsung Galaxy S24', amount: 44900, customer: 'นายธนา วงศ์', date: '2024-12-03T08:45:00Z' }
  ],
  topProducts: [
    { id: 1, name: 'iPhone 15 Pro Max', sales: 150, revenue: 6585000 },
    { id: 2, name: 'MacBook Air M3', sales: 89, revenue: 3818100 },
    { id: 3, name: 'Samsung Galaxy S24', sales: 67, revenue: 3008300 }
  ],
  alerts: [
    { id: 1, type: 'low_stock', message: 'Nintendo Switch OLED มีสต็อกต่ำ (5 ชิ้น)', priority: 'high' },
    { id: 2, type: 'reorder', message: 'ควรสั่งซื้อ Canon EOS R6 Mark II เพิ่ม', priority: 'medium' },
    { id: 3, type: 'promotion', message: 'โปรโมชั่น Sony WH-1000XM5 จะหมดอายุใน 3 วัน', priority: 'low' }
  ],
  chartData: {
    sales: [
      { month: 'Jan', revenue: 185000, orders: 120 },
      { month: 'Feb', revenue: 220000, orders: 145 },
      { month: 'Mar', revenue: 195000, orders: 135 },
      { month: 'Apr', revenue: 240000, orders: 160 },
      { month: 'May', revenue: 265000, orders: 175 },
      { month: 'Jun', revenue: 285000, orders: 190 }
    ],
    categories: [
      { name: 'Electronics', value: 45, color: '#8884d8' },
      { name: 'Computers', value: 30, color: '#82ca9d' },
      { name: 'Audio', value: 15, color: '#ffc658' },
      { name: 'Others', value: 10, color: '#ff7300' }
    ]
  }
});

// GET /json/inventory.json - ข้อมูล Inventory แบบ JSON
router.get('/inventory.json', (req, res) => {
  try {
    const inventoryData = getInventoryJSON();
    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load inventory data', message: error.message });
  }
});

// GET /json/products.json - ข้อมูล Products แบบ JSON  
router.get('/products.json', (req, res) => {
  try {
    const productsData = getProductsJSON();
    res.json(productsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products data', message: error.message });
  }
});

// GET /json/categories.json - ข้อมูล Categories แบบ JSON
router.get('/categories.json', (req, res) => {
  try {
    const categoriesData = getCategoriesJSON();
    res.json(categoriesData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories data', message: error.message });
  }
});

// GET /json/dashboard.json - ข้อมูล Dashboard แบบ JSON
router.get('/dashboard.json', (req, res) => {
  try {
    const dashboardData = getDashboardJSON();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard data', message: error.message });
  }
});

// GET /json/mock-data.json - ข้อมูลรวมทั้งหมด
router.get('/mock-data.json', (req, res) => {
  try {
    const allData = {
      inventory: getInventoryJSON(),
      products: getProductsJSON(), 
      categories: getCategoriesJSON(),
      dashboard: getDashboardJSON(),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        totalRecords: {
          inventory: getInventoryJSON().length,
          products: getProductsJSON().length,
          categories: getCategoriesJSON().length
        }
      }
    };
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load mock data', message: error.message });
  }
});

// GET /json - แสดงรายการ JSON endpoints ทั้งหมด
router.get('/', (req, res) => {
  res.json({
    message: 'JSON API Endpoints',
    version: '1.0.0',
    endpoints: {
      inventory: '/json/inventory.json',
      products: '/json/products.json', 
      categories: '/json/categories.json',
      dashboard: '/json/dashboard.json',
      mockData: '/json/mock-data.json'
    },
    description: 'Static JSON endpoints for frontend development'
  });
});

module.exports = router;
