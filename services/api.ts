import { config } from '../config/environment';

// API configuration
const API_BASE_URL = config.api.baseUrl;

// Product interfaces
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  stock?: number;
  brand?: string;
  featured?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}

// Products API
export const productsApi = {
  // Get all products
  getAll: async (params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Product[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const url = `${API_BASE_URL}/products?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get single product
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get products by category
  getByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get featured products
  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/featured/list`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

// Authentication API
export const authApi = {
  // Login
  login: async (loginData: { login: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Register
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get current user
  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

// Users API
export const usersApi = {
  // Get all users (Admin only)
  getAll: async (params?: {
    role?: string;
    active?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.role) searchParams.append('role', params.role);
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const url = `${API_BASE_URL}/users?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get public user profiles (for display purposes)
  getPublic: async (limit?: number): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());
    
    const url = `${API_BASE_URL}/users/public?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get single user
  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

// Enhanced API error handler
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
    return 'Network error. Please check your internet connection or try again later.';
  }
  
  if (error.message?.includes('404')) {
    return 'API endpoint not found. Please check if the server is running.';
  }
  
  if (error.message?.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  if (error.message?.includes('401')) {
    return 'Authentication required. Please log in again.';
  }
  
  if (error.message?.includes('403')) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  // Check if we have a response with error data
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  // For development, show more detailed errors
  if (config.isDevelopment) {
    return error.message || 'An unexpected error occurred during development';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default {
  products: productsApi,
  auth: authApi,
  users: usersApi,
  handleApiError,
};
