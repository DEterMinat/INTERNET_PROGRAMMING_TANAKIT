// API configuration
const API_BASE_URL = 'http://localhost:9785/api';

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
  // Get all users
  getAll: async (params?: {
    role?: string;
    active?: boolean;
  }): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.role) searchParams.append('role', params.role);
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    
    const url = `${API_BASE_URL}/users?${searchParams.toString()}`;
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

// Generic API error handler
export const handleApiError = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export default {
  products: productsApi,
  auth: authApi,
  users: usersApi,
  handleApiError,
};
