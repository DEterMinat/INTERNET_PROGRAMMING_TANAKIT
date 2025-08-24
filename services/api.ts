import { apiConfig } from '../config/environment';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API Service Class สำหรับ Frontend
class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = apiConfig.getCurrentBaseUrl();
  }

  // Health Check - ตรวจสอบสถานะ Backend และ Database
  async healthCheck(): Promise<ApiResponse> {
    const endpoint = apiConfig.endpoints.dashboard.health as string;
    return this.request(endpoint);
  }
  
  // Helper method สำหรับ HTTP requests with fallback
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const primaryUrl = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // พยายามเชื่อมต่อ primary URL ก่อน
    try {
      console.log(`🔄 Trying primary API: ${primaryUrl}`);
      const response = await fetch(primaryUrl, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`✅ Primary API success: ${primaryUrl}`);
      return result;
    } catch (primaryError) {
      console.warn(`❌ Primary API failed: ${primaryError}`);
      
      // หาก primary API ล้มเหลว ให้ลอง fallback URLs
      const fallbackUrls = apiConfig.fallbackUrls?.development || [];
      
      for (const fallbackBaseUrl of fallbackUrls) {
        try {
          const fallbackUrl = `${fallbackBaseUrl}${endpoint}`;
          console.log(`🔄 Trying fallback API: ${fallbackUrl}`);
          
          const response = await fetch(fallbackUrl, mergedOptions);
          
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Fallback API success: ${fallbackUrl}`);
            return result;
          }
        } catch (fallbackError) {
          console.warn(`❌ Fallback API failed: ${fallbackError}`);
          continue;
        }
      }
      
      // หาก API ทุกตัวล้มเหลว
      throw new Error(`All API endpoints failed. Primary: ${primaryError}`);
    }
  }

  // Inventory API Methods
  inventory = {
    // GET /api/inventory - รายการสินค้า
    getList: async (params?: {
      category?: string;
      search?: string;
      status?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const endpoint = apiConfig.endpoints.inventory.list as string;
      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return this.request(url);
    },
    
    // GET /api/inventory/:id - รายละเอียดสินค้า
    getById: async (id: number) => {
      const endpoint = apiConfig.endpoints.inventory.getById as (id: number) => string;
      return this.request(endpoint(id));
    },
    
    // GET /api/inventory/categories - หมวดหมู่สินค้า
    getCategories: async () => {
      const endpoint = apiConfig.endpoints.inventory.categories as string;
      return this.request(endpoint);
    },
    
    // GET /api/inventory/stats - สถิติสินค้า
    getStats: async () => {
      const endpoint = apiConfig.endpoints.inventory.stats as string;
      return this.request(endpoint);
    },
    
    // POST /api/inventory - เพิ่มสินค้าใหม่
    create: async (data: any) => {
      const endpoint = apiConfig.endpoints.inventory.create as string;
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    // PUT /api/inventory/:id - แก้ไขสินค้า
    update: async (id: number, data: any) => {
      const endpoint = apiConfig.endpoints.inventory.update as (id: number) => string;
      return this.request(endpoint(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    // DELETE /api/inventory/:id - ลบสินค้า
    delete: async (id: number) => {
      const endpoint = apiConfig.endpoints.inventory.delete as (id: number) => string;
      return this.request(endpoint(id), {
        method: 'DELETE',
      });
    }
  };

  // Dashboard API Methods  
  dashboard = {
    // GET /api/dashboard - ข้อมูล Dashboard หลัก
    getOverview: async () => {
      const endpoint = apiConfig.endpoints.dashboard.overview as string;
      return this.request(endpoint);
    },
    
    // GET /api/dashboard/sales - ข้อมูลยอดขาย
    getSales: async (period?: string) => {
      const endpoint = apiConfig.endpoints.dashboard.sales as string;
      const url = period ? `${endpoint}?period=${period}` : endpoint;
      return this.request(url);
    },
    
    // GET /api/dashboard/analytics - ข้อมูลการวิเคราะห์
    getAnalytics: async () => {
      const endpoint = apiConfig.endpoints.dashboard.analytics as string;
      return this.request(endpoint);
    },
    
    // GET /api/dashboard/reports - รายงาน
    getReports: async (type?: string) => {
      const endpoint = apiConfig.endpoints.dashboard.reports as string;
      const url = type ? `${endpoint}?type=${type}` : endpoint;
      return this.request(url);
    }
  };

  // Products API Methods - Updated for Database API
  products = {
    // GET /api/db-products - รายการผลิตภัณฑ์จาก Database
    getList: async (params?: {
      category?: string;
      search?: string;
      featured?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const endpoint = apiConfig.endpoints.products.list as string;
      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return this.request(url);
    },
    
    // GET /api/db-products/:id - รายละเอียดผลิตภัณฑ์จาก Database
    getById: async (id: number) => {
      const endpoint = apiConfig.endpoints.products.getById as (id: number) => string;
      return this.request(endpoint(id));
    },
    
    // GET /api/db-products/statistics - สถิติผลิตภัณฑ์
    getStatistics: async () => {
      const endpoint = apiConfig.endpoints.products.statistics as string;
      return this.request(endpoint);
    },
    
    // GET /api/db-products/featured - ผลิตภัณฑ์แนะนำ
    getFeatured: async () => {
      const endpoint = apiConfig.endpoints.products.featured as string;
      return this.request(endpoint);
    },
    
    // GET /api/db-products/categories - หมวดหมู่ผลิตภัณฑ์
    getCategories: async () => {
      const endpoint = apiConfig.endpoints.products.categories as string;
      return this.request(endpoint);
    }
  };

  // Users API Methods
  users = {
    // GET /api/users/public - ผู้ใช้สาธารณะ
    getPublic: async (limit?: number) => {
      const endpoint = apiConfig.endpoints.users.public as string;
      const url = limit ? `${endpoint}?limit=${limit}` : endpoint;
      return this.request(url);
    },
    
    // GET /api/users - รายการผู้ใช้ทั้งหมด
    getList: async (params?: {
      role?: string;
      active?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const endpoint = apiConfig.endpoints.users.list as string;
      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return this.request(url);
    },
    
    // GET /api/users/:id - รายละเอียดผู้ใช้
    getById: async (id: number) => {
      const endpoint = apiConfig.endpoints.users.getById as (id: number) => string;
      return this.request(endpoint(id));
    }
  };

  // JSON Static Files - สำหรับ Development
  json = {
    // GET /json/inventory.json - ข้อมูล Inventory แบบ JSON
    getInventory: async () => {
      const endpoint = apiConfig.endpoints.json.inventory;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/products.json - ข้อมูล Products แบบ JSON  
    getProducts: async () => {
      const endpoint = apiConfig.endpoints.json.products;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/dashboard.json - ข้อมูล Dashboard แบบ JSON
    getDashboard: async () => {
      const endpoint = apiConfig.endpoints.json.dashboard;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/mock-data.json - ข้อมูลทั้งหมดแบบ JSON
    getMockData: async () => {
      const endpoint = apiConfig.endpoints.json.mockData;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    }
  };

  // Utility Methods
  utils = {
    // เปลี่ยน Base URL (สำหรับ testing หรือ environment switching)
    setBaseUrl: (newUrl: string) => {
      this.baseUrl = newUrl;
    },
    
    // ดึง Base URL ปัจจุบัน
    getBaseUrl: () => this.baseUrl,
    
    // สร้าง URL เต็ม
    buildUrl: (category: string, endpoint: string, params?: any) => {
      return apiConfig.buildUrl(category, endpoint, params);
    }
  };
}

// Export singleton instance
export const api = new ApiService();

// Export types for use in components
export type { ApiResponse };

// Export helper functions
export const getApiUrl = () => apiConfig.getCurrentBaseUrl();
export { apiConfig };

// Export individual API modules for easier imports
export const productsApi = {
  getAll: api.products.getList,
  getList: api.products.getList,
  getById: api.products.getById,
  getFeatured: api.products.getFeatured,
  getStatistics: api.products.getStatistics,
  getCategories: api.products.getCategories
};

export const usersApi = {
  getPublic: api.users.getPublic,
  getAll: api.users.getList,
  getList: api.users.getList,
  getById: api.users.getById
};

export const inventoryApi = {
  getAll: api.inventory.getList,
  getList: api.inventory.getList,
  getById: api.inventory.getById,
  getCategories: api.inventory.getCategories,
  getStats: api.inventory.getStats,
  create: api.inventory.create,
  update: api.inventory.update,
  delete: api.inventory.delete
};

export const dashboardApi = {
  getOverview: api.dashboard.getOverview,
  getSales: api.dashboard.getSales,
  getAnalytics: api.dashboard.getAnalytics,
  getReports: api.dashboard.getReports
};
