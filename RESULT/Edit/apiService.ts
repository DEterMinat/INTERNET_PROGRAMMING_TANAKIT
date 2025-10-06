// ============================================
// API Service - Edit (Update) Functionality
// File: services/apiService.ts
// ============================================

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
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ============================================
  // Inventory API Methods
  // ============================================
  inventory = {
    // GET /api/inventory - Get inventory list
    getList: async (params?: {
      category?: string;
      search?: string;
      status?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
    }) => {
      let endpoint = apiConfig.endpoints.inventory.list as string;
      
      if (params) {
        const queryParams = new URLSearchParams();
        
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint = `${endpoint}?${queryString}`;
        }
      }
      
      return this.request(endpoint);
    },

    // GET /api/inventory/:id - Get single item
    getById: async (id: number) => {
      const endpoint = `/api/inventory/${id}`;
      console.log('📖 Fetching inventory item:', id);
      console.log('URL:', `${apiConfig.getCurrentBaseUrl()}${endpoint}`);
      
      return this.request(endpoint);
    },

    // GET /api/inventory/stats - Get statistics
    getStats: async () => {
      const endpoint = apiConfig.endpoints.inventory.stats as string;
      return this.request(endpoint);
    },

    // POST /api/inventory - Create new item
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
      console.log('➕ Creating inventory item:', data);
      
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // ============================================
    // ✏️ PUT /api/inventory/:id - Update item (EDIT)
    // ============================================
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
      console.log('✏️ Updating inventory item:', id);
      console.log('Update URL:', `${apiConfig.getCurrentBaseUrl()}${endpoint}`);
      console.log('Update data:', data);
      
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // DELETE /api/inventory/:id - Delete item
    delete: async (id: number) => {
      const endpoint = `/api/inventory/${id}`;
      console.log('🗑️ Deleting inventory item:', id);
      
      return this.request(endpoint, {
        method: 'DELETE',
      });
    },

    // PUT /api/inventory/:id/stock - Update stock level only
    updateStock: async (id: number, stock: number, operation?: string) => {
      const endpoint = `/api/inventory/${id}/stock`;
      console.log('📦 Updating stock:', { id, stock, operation });
      
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ stock, operation }),
      });
    }
  };
}

// Export singleton instance
export const apiService = new ApiService();
