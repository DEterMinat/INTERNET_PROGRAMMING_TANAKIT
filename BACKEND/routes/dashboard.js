const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper function to read JSON files
const readJsonFile = async (filename) => {
  try {
    const filePath = path.join('./data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Dashboard Mock Data - Now reading from JSON file
const getDashboardStats = async () => {
  const dashboardData = await readJsonFile('dashboard.json');
  return dashboardData || {
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      monthlyGrowth: 0,
      weeklyGrowth: 0,
      dailyGrowth: 0
    }
  };
};

const getSalesData = async () => {
  const dashboardData = await readJsonFile('dashboard.json');
  return dashboardData?.sales || {
    today: { sales: 0, orders: 0, averageOrder: 0, conversion: 0 },
    thisWeek: { sales: 0, orders: 0, averageOrder: 0, conversion: 0 },
    thisMonth: { sales: 0, orders: 0, averageOrder: 0, conversion: 0 },
    chartData: [],
    topProducts: []
  };
};

const getAnalyticsData = async () => {
  const dashboardData = await readJsonFile('dashboard.json');
  return dashboardData?.analytics || {
    traffic: { totalVisitors: 0, uniqueVisitors: 0, pageViews: 0, bounceRate: 0, avgSessionDuration: '0:00' },
    demographics: { ageGroups: [], locations: [] },
    performance: { conversionRate: 0, avgOrderValue: 0, customerLifetimeValue: 0, returnCustomerRate: 0 }
  };
};

const getReportsData = async () => {
  const dashboardData = await readJsonFile('dashboard.json');
  return dashboardData?.reports || {
    inventory: { mostSold: [], leastSold: [], profitability: [] },
    financial: { revenue: {}, profit: {}, expenses: {} }
  };
};

// GET /api/dashboard - Dashboard Overview
router.get('/', async (req, res) => {
  try {
    const dashboardData = await getDashboardStats();
    
    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// GET /api/dashboard/sales - Sales Analytics
router.get('/sales', async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const salesData = await getSalesData();
    
    res.json({
      success: true,
      data: salesData,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales data',
      message: error.message
    });
  }
});

// GET /api/dashboard/analytics - Web Analytics
router.get('/analytics', async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    
    res.json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data',
      message: error.message
    });
  }
});

// GET /api/dashboard/reports - Business Reports
router.get('/reports', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const reportsData = await getReportsData();
    
    let responseData = reportsData;
    if (type !== 'all') {
      responseData = reportsData[type] || {};
    }
    
    res.json({
      success: true,
      data: responseData,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports data',
      message: error.message
    });
  }
});

module.exports = router;
