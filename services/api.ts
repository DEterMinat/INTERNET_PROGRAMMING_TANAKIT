import { getApiUrl } from '../config/environment';

// API base configuration
const API_BASE_URL = getApiUrl();

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Products API
export const productsApi = {
  // Get all products with optional filters
  getAll: (params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get single product by ID
  getById: (id: number) => {
    return apiRequest(`/api/products/${id}`);
  },

  // Get featured products
  getFeatured: (limit?: number) => {
    return productsApi.getAll({ featured: true, limit });
  },
};

// Users API
export const usersApi = {
  // Get public users
  getPublic: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiRequest(`/api/users/public${params}`);
  },

  // Get all users (admin only)
  getAll: (params?: {
    role?: string;
    active?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },
};

// Auth API
export const authApi = {
  // Login user
  login: (credentials: { email: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user info
  me: () => {
    return apiRequest('/api/auth/me');
  },
};

// Health check
export const healthApi = {
  check: () => {
    return apiRequest('/health');
  },
};

// Export all APIs
export const api = {
  products: productsApi,
  users: usersApi,
  auth: authApi,
  health: healthApi,
};

export default api;
