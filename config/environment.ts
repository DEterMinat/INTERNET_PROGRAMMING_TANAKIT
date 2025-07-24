// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const config = {
  // API Base URLs
  api: {
    development: 'http://localhost:9785/api',
    production: 'http://119.59.102.61:9785/api',
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
