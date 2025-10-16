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
  
  // Helper method สำหรับ HTTP requests
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
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

    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
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
      const endpointFn = apiConfig.endpoints.inventory.getById as (id: number) => string;
      const endpoint = endpointFn(id);
      return this.request(endpoint);
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
    create: async (data: {
      name: string;
      category: string;
      price: number;
      stock: number;
      brand?: string;
      description?: string;
      image?: string;
      minStock?: number;
      maxStock?: number;
    }) => {
      const endpoint = apiConfig.endpoints.inventory.list as string;
      console.log('apiService.inventory.create called');
      console.log('Base URL:', this.baseUrl);
      console.log('Endpoint:', endpoint);
      console.log('Full URL:', `${this.baseUrl}${endpoint}`);
      console.log('Data:', data);
      
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // PUT /api/inventory/:id - อัพเดทสินค้า
    update: async (id: number, data: {
      name?: string;
      category?: string;
      price?: number;
      stock?: number;
      brand?: string;
      description?: string;
      image?: string;
      featured?: boolean;
    }) => {
      const endpoint = `/api/inventory/${id}`;
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // DELETE /api/inventory/:id - ลบสินค้า
    delete: async (id: number) => {
      const endpoint = `/api/inventory/${id}`;
      return this.request(endpoint, {
        method: 'DELETE',
      });
    },

    // PUT /api/inventory/:id/stock - อัพเดทจำนวนสต็อก
    updateStock: async (id: number, stock: number, adjustment?: number) => {
      const endpoint = `/api/inventory/${id}/stock`;
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ stock, adjustment }),
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

  // Products API Methods
  products = {
    // GET /api/products - รายการผลิตภัณฑ์
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
    
    // GET /api/products/featured - ผลิตภัณฑ์แนะนำ
    getFeatured: async () => {
      const endpoint = apiConfig.endpoints.products.featured as string;
      return this.request(endpoint);
    },

    // POST /api/products - เพิ่มผลิตภัณฑ์ใหม่
    create: async (data: {
      name: string;
      price: number;
      category: string;
      stock: number;
      image?: string;
      rating?: number;
      description?: string;
      brand?: string;
      featured?: boolean;
    }) => {
      const endpoint = apiConfig.endpoints.products.list as string;
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // PUT /api/products/:id - อัพเดทผลิตภัณฑ์
    update: async (id: number, data: {
      name?: string;
      price?: number;
      image?: string;
      category?: string;
      rating?: number;
      description?: string;
      stock?: number;
      brand?: string;
      featured?: boolean;
    }) => {
      const endpoint = `/api/products/${id}`;
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // DELETE /api/products/:id - ลบผลิตภัณฑ์
    delete: async (id: number) => {
      const endpoint = `/api/products/${id}`;
      return this.request(endpoint, {
        method: 'DELETE',
      });
    }
  };

  // JSON Static Files - สำหรับ Development
  json = {
    // GET /json/inventory.json - ข้อมูล Inventory แบบ JSON
    getInventory: async () => {
      const endpoint = apiConfig.endpoints.json.inventory as string;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/products.json - ข้อมูล Products แบบ JSON  
    getProducts: async () => {
      const endpoint = apiConfig.endpoints.json.products as string;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/dashboard.json - ข้อมูล Dashboard แบบ JSON
    getDashboard: async () => {
      const endpoint = apiConfig.endpoints.json.dashboard as string;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    },
    
    // GET /json/mock-data.json - ข้อมูลทั้งหมดแบบ JSON
    getMockData: async () => {
      const endpoint = apiConfig.endpoints.json.mockData as string;
      return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
    }
  };

  // Final Exam Inventory API Methods
  finalInventory = {
    // GET /api/final-inventory - list
    getList: async () => {
      const endpoint = '/api/final-inventory';
      return this.request(endpoint);
    },

    // GET /api/final-inventory/:id
    getById: async (id: number) => {
      const endpoint = `/api/final-inventory/${id}`;
      return this.request(endpoint);
    },

    // POST /api/final-inventory
    create: async (data: { name: string; qty: number; price: number; img?: string }) => {
      const endpoint = '/api/final-inventory';
      return this.request(endpoint, { method: 'POST', body: JSON.stringify({ name: data.name, qty: data.qty, price: data.price, img: data.img }) });
    },

    // PUT /api/final-inventory/:id
    update: async (id: number, data: { name?: string; qty?: number; price?: number; img?: string }) => {
      const endpoint = `/api/final-inventory/${id}`;
      return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
    },

    // DELETE /api/final-inventory/:id
    delete: async (id: number) => {
      const endpoint = `/api/final-inventory/${id}`;
      return this.request(endpoint, { method: 'DELETE' });
    }
  };
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { ApiResponse };

// Export helper functions
export const getApiUrl = () => apiConfig.getCurrentBaseUrl();
export { apiConfig };

