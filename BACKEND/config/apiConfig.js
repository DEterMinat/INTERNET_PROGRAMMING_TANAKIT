// API Configuration และ Endpoints สำหรับ Frontend
module.exports = {
  // Base API Configuration
  api: {
    version: 'v1',
    basePath: '/api',
    port: process.env.PORT || 9785,
    host: process.env.HOST || 'localhost'
  },

  // Endpoints Configuration - เปลี่ยน Path ได้ง่าย
  endpoints: {
    // Inventory Management
    inventory: {
      basePath: '/api/inventory',
      routes: {
        list: '/',                    // GET /api/inventory
        create: '/',                  // POST /api/inventory  
        getById: '/:id',             // GET /api/inventory/:id
        update: '/:id',              // PUT /api/inventory/:id
        delete: '/:id',              // DELETE /api/inventory/:id
        categories: '/categories',    // GET /api/inventory/categories
        stats: '/stats',             // GET /api/inventory/stats
        search: '/search',           // GET /api/inventory/search
        lowStock: '/low-stock',      // GET /api/inventory/low-stock
        export: '/export',           // GET /api/inventory/export
        import: '/import'            // POST /api/inventory/import
      }
    },

    // Products Management  
    products: {
      basePath: '/api/products',
      routes: {
        list: '/',                   // GET /api/products
        create: '/',                 // POST /api/products
        getById: '/:id',            // GET /api/products/:id
        update: '/:id',             // PUT /api/products/:id
        delete: '/:id',             // DELETE /api/products/:id
        featured: '/featured',       // GET /api/products/featured
        categories: '/categories',   // GET /api/products/categories
        search: '/search'           // GET /api/products/search
      }
    },

    // User Management
    users: {
      basePath: '/api/users',
      routes: {
        list: '/',                  // GET /api/users
        create: '/',                // POST /api/users
        getById: '/:id',           // GET /api/users/:id
        update: '/:id',            // PUT /api/users/:id
        delete: '/:id',            // DELETE /api/users/:id
        profile: '/profile'        // GET /api/users/profile
      }
    },

    // Authentication
    auth: {
      basePath: '/api/auth',
      routes: {
        login: '/login',           // POST /api/auth/login
        register: '/register',     // POST /api/auth/register
        logout: '/logout',         // POST /api/auth/logout
        refresh: '/refresh',       // POST /api/auth/refresh
        verify: '/verify',         // GET /api/auth/verify
        reset: '/reset-password'   // POST /api/auth/reset-password
      }
    },

    // Dashboard & Analytics
    dashboard: {
      basePath: '/api/dashboard',
      routes: {
        overview: '/',             // GET /api/dashboard
        sales: '/sales',           // GET /api/dashboard/sales
        analytics: '/analytics',   // GET /api/dashboard/analytics
        reports: '/reports'        // GET /api/dashboard/reports
      }
    },

    // Static JSON Files - สำหรับ Frontend
    json: {
      basePath: '/json',
      routes: {
        inventory: '/inventory.json',           // GET /json/inventory.json
        products: '/products.json',            // GET /json/products.json
        categories: '/categories.json',        // GET /json/categories.json
        dashboard: '/dashboard.json',          // GET /json/dashboard.json
        mockData: '/mock-data.json'           // GET /json/mock-data.json
      }
    }
  },

  // Environment URLs - เปลี่ยนได้ง่าย
  urls: {
    development: {
      backend: 'http://localhost:9785',
      frontend: 'http://localhost:8081'
    },
    production: {
      backend: 'https://nindam.sytes.net',
      frontend: 'https://nindam.sytes.net'
    },
    staging: {
      backend: 'http://119.59.102.61:9785',
      frontend: 'http://119.59.102.61:3000'
    }
  },

  // Helper function to get current environment URL
  getCurrentUrl: (env = 'development') => {
    return module.exports.urls[env] || module.exports.urls.development;
  },

  // Helper function to build full endpoint URL
  buildEndpointUrl: (category, route, env = 'development') => {
    const baseUrl = module.exports.getCurrentUrl(env).backend;
    const endpoint = module.exports.endpoints[category];
    if (!endpoint) return null;
    
    const routePath = endpoint.routes[route];
    if (!routePath) return null;
    
    return `${baseUrl}${endpoint.basePath}${routePath}`;
  }
};
