// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const config = {
  // API Base URLs
  api: {
    development: 'http://localhost:9785',
    production: 'http://119.59.102.61:9785',
    get baseUrl() {
      return isDevelopment ? this.development : this.production;
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
  return config.api.baseUrl;
};
