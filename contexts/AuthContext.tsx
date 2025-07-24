import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginData: { login: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (userData: User, authToken: string) => {
    try {
      await AsyncStorage.setItem('auth_token', authToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth:', error);
      throw error;
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const login = async (loginData: { login: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(loginData);
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        await storeAuth(userData, authToken);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token: authToken } = response.data;
        await storeAuth(newUser, authToken);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await clearAuth();
    setIsLoading(false);
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      // If you have a refresh user endpoint, call it here
      // For now, we'll just keep the existing user data
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, logout the user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
