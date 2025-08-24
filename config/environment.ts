// Environment configuration สำหรับ API URLs
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// API Configuration Types
interface ApiEndpoints {
  [key: string]: string | ((param: any) => string);
}

interface ApiConfig {
  baseUrls: {
    development: string;
    staging: string;
    production: string;
  };
  fallbackUrls: {
    development: string[];
    production: string[];
  };
  endpoints: {
    inventory: ApiEndpoints;
    products: ApiEndpoints;
    dashboard: ApiEndpoints;
    auth: ApiEndpoints;
    users: ApiEndpoints;
    json: ApiEndpoints;
  };
  getCurrentBaseUrl(): string;
  buildUrl(category: string, endpoint: string, params?: any): string;
}

// API Configuration - เปลี่ยน Path ได้ง่าย
export const apiConfig: ApiConfig = {
  // Base URLs สำหรับแต่ละ Environment
  baseUrls: {
    development: 'http://119.59.102.61:9785',
    staging: 'http://119.59.102.61:9785', 
    production: 'http://119.59.102.61:9785'
  },
  
  // Fallback URLs สำหรับกรณี primary server ไม่พร้อม
  fallbackUrls: {
    development: ['http://localhost:9785', 'http://127.0.0.1:9785'],
    production: ['http://localhost:9785', 'http://nindam.sytes.net:9785']
  },
  
  // API Endpoints - สามารถเปลี่ยนได้ง่าย
  endpoints: {
    // Inventory Management
    inventory: {
      list: '/api/inventory',
      create: '/api/inventory',
      getById: (id: number) => `/api/inventory/${id}`,
      update: (id: number) => `/api/inventory/${id}`,
      delete: (id: number) => `/api/inventory/${id}`,
      categories: '/api/inventory/categories',
      stats: '/api/inventory/stats',
      search: '/api/inventory/search',
      lowStock: '/api/inventory/low-stock'
    },
    
    // Products Management - Updated for Database API
    products: {
      list: '/api/db-products',              // ดึงข้อมูลจาก database
      getById: (id: number) => `/api/db-products/${id}`,
      statistics: '/api/db-products/statistics',
      search: '/api/db-products/search',
      categories: '/api/db-products/categories',
      featured: '/api/db-products/featured',
      // Legacy endpoint (still available)
      legacy: '/api/products'
    },
    
    // Dashboard & Analytics - Updated for Database
    dashboard: {
      overview: '/api/dashboard',
      inventory: '/api/inventory',
      statistics: '/api/db-products/statistics',
      sales: '/api/dashboard/sales',
      analytics: '/api/dashboard/analytics', 
      reports: '/api/dashboard/reports',
      health: '/health'
    },
    
    // Authentication
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
      verify: '/api/auth/verify'
    },
    
    // Users Management
    users: {
      list: '/api/users',
      create: '/api/users',
      getById: (id: number) => `/api/users/${id}`,
      update: (id: number) => `/api/users/${id}`,
      delete: (id: number) => `/api/users/${id}`,
      public: '/api/users/public',
      profile: '/api/users/profile'
    },
    
    // JSON Static Files - สำหรับ Development
    json: {
      inventory: '/json/inventory.json',
      products: '/json/products.json',
      categories: '/json/categories.json',
      dashboard: '/json/dashboard.json',
      mockData: '/json/mock-data.json'
    }
  },
  
  // Helper Methods
  getCurrentBaseUrl(): string {
    // ตรวจสอบ environment อัตโนมัติ
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const env = isDev ? 'development' : 'production';
    
    console.log(`🌐 API Environment: ${env}, URL: ${this.baseUrls[env]}`);
    return this.baseUrls[env];
  },
  
  // สร้าง Full URL สำหรับ API Call
  buildUrl(category: string, endpoint: string, params?: any): string {
    const baseUrl = this.getCurrentBaseUrl();
    const endpointConfig = this.endpoints[category as keyof typeof this.endpoints];
    
    if (!endpointConfig || !endpointConfig[endpoint]) {
      throw new Error(`Endpoint ${String(category)}.${endpoint} not found`);
    }
    
    const path = typeof endpointConfig[endpoint] === 'function' 
      ? (endpointConfig[endpoint] as Function)(params)
      : endpointConfig[endpoint];
    
    return `${baseUrl}${path}`;
  }
};

export const config = {
  // Legacy API configuration (สำหรับ backward compatibility)
  api: {
    development: apiConfig.baseUrls.development,
    production: apiConfig.baseUrls.production,
    get baseUrl() {
      return apiConfig.getCurrentBaseUrl();
    }
  },
  
  // Environment info
  isDevelopment,
  isProduction: !isDevelopment,
  
  // Other configurations
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
};

// Helper function to get API URL
export const getApiUrl = () => {
  return 'http://nindam.sytes.net:9785';
};
