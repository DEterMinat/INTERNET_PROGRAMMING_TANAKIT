# API Documentation

## Overview
This API provides complete inventory management functionality with MySQL database integration. All endpoints return data from the MySQL database with fallback to mock data if database is unavailable.

## Base URL
- Local: `http://localhost:3001/api`
- Production: `http://nindam.sytes.net:3001/api`

## Authentication
Some endpoints may require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Available Routes

### 1. Database Products (`/api/db-products`)
**Primary product management endpoints with full MySQL integration**

#### GET `/api/db-products/`
- **Description:** Get all products with filtering, sorting, and pagination
- **Query Parameters:**
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `category` (string): Filter by category
  - `brand` (string): Filter by brand
  - `featured` (0|1): Filter featured products
  - `search` (string): Search in name, description, brand
  - `sortBy` (string): Sort column (id, name, price, category, brand, stock, rating, featured, created_at, updated_at)
  - `sortOrder` (ASC|DESC): Sort direction

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "price": 43900,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 25,
      "rating": 4.9,
      "featured": 1,
      "image": "image_url",
      "description": "Latest iPhone..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET `/api/db-products/:id`
- **Description:** Get single product by ID
- **Response:** Single product object

#### GET `/api/db-products/statistics`
- **Description:** Get product statistics
- **Response:** Statistics including total products, categories, stock levels, etc.

#### GET `/api/db-products/categories`
- **Description:** Get all unique categories
- **Response:** Array of category names

#### GET `/api/db-products/brands`
- **Description:** Get all unique brands
- **Response:** Array of brand names

### 2. Products (`/api/products`)
**Standard product endpoints with database integration**

#### GET `/api/products/`
- **Description:** Get products with filtering and search
- **Query Parameters:**
  - `category` (string): Filter by category
  - `search` (string): Search products
  - `minPrice`, `maxPrice` (number): Price range
  - `featured` (true/false): Filter featured products
  - `limit`, `offset` (number): Pagination

#### GET `/api/products/featured`
- **Description:** Get featured products only
- **Response:** Array of featured products

#### GET `/api/products/categories`
- **Description:** Get all categories
- **Response:** Array of categories

#### GET `/api/products/:id`
- **Description:** Get single product
- **Response:** Product object

#### GET `/api/products/search/:query`
- **Description:** Search products by query
- **Response:** Array of matching products

### 3. Inventory (`/api/inventory`)
**Inventory management with stock tracking**

#### GET `/api/inventory/`
- **Description:** Get inventory items with stock information
- **Query Parameters:**
  - `category` (string): Filter by category
  - `search` (string): Search inventory
  - `status` (string): Filter by status
  - `limit`, `offset` (number): Pagination
  - `sortBy` (string): Sort field

#### GET `/api/inventory/stats`
- **Description:** Get inventory statistics
- **Response:** Statistics including total items, total value, low stock items

#### GET `/api/inventory/:id`
- **Description:** Get single inventory item
- **Response:** Inventory item with stock details

#### PUT `/api/inventory/:id/stock`
- **Description:** Update stock level
- **Body:**
```json
{
  "stock": 50,
  "operation": "set" // or "add" or "subtract"
}
```

#### GET `/api/inventory/alerts/low-stock`
- **Description:** Get low stock items
- **Response:** Array of items with low stock

#### GET `/api/inventory/meta/categories`
- **Description:** Get all inventory categories
- **Response:** Array of categories

### 4. Dashboard (`/api/dashboard`)
**Dashboard analytics and statistics**

#### GET `/api/dashboard/`
- **Description:** Get complete dashboard data
- **Response:** Complete dashboard with stats, sales, and analytics

#### GET `/api/dashboard/stats`
- **Description:** Get overview statistics
- **Response:** Basic statistics (total products, value, categories, etc.)

#### GET `/api/dashboard/sales`
- **Description:** Get sales data
- **Response:** Sales statistics and top products

#### GET `/api/dashboard/analytics`
- **Description:** Get analytics data
- **Response:** Traffic, demographics, and performance metrics

### 5. Authentication (`/api/auth`)
**User authentication and management**

#### POST `/api/auth/register`
- **Description:** Register new user
- **Body:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST `/api/auth/login`
- **Description:** User login
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
- **Description:** Get user profile (requires authentication)
- **Headers:** `Authorization: Bearer <token>`

#### PUT `/api/auth/profile`
- **Description:** Update user profile (requires authentication)

### 6. Users (`/api/users`)
**User management endpoints**

#### GET `/api/users/`
- **Description:** Get all users (admin only)
- **Response:** Array of user objects

#### GET `/api/users/:id`
- **Description:** Get single user
- **Response:** User object

#### PUT `/api/users/:id`
- **Description:** Update user information

#### DELETE `/api/users/:id`
- **Description:** Delete user (admin only)

## Database Configuration

The API connects to MySQL database with the following configuration:
- **Host:** localhost (production server) / nindam.sytes.net (testing)
- **Port:** 3306
- **Database:** ku_inventory_tanakit
- **Tables:** products, users

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Fallback

If database connection fails, the API falls back to mock data to ensure continuous operation. This ensures the application remains functional even during database maintenance or connectivity issues.

## Production Deployment

1. Deploy to server (nindam.sytes.net)
2. Set `DB_HOST=localhost` in production `.env`
3. Ensure MySQL service is running
4. Database connection will be established automatically
5. All endpoints will use live database data

The API is production-ready with comprehensive error handling, input validation, and SQL injection protection.
