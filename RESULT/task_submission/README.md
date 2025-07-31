# Inventory Management System

## 📱 Overview
This is a React Native Inventory Management App with the following features:

### ✨ Key Features
1. **Product Inventory Display** - Shows products in grid/list view
2. **Real-time Data** - Retrieves data from cloud (nindam.sytes.net)
3. **Search & Filter** - Search by name, SKU, barcode with category filters
4. **Stock Management** - Color-coded stock status (Low/Normal/Full)
5. **Detailed View** - Modal with complete product information
6. **Statistics Dashboard** - Shows total items, value, low stock alerts
7. **Responsive Design** - Optimized for mobile with smooth UX/UI

### 🎯 UX/UI Improvements
- **Modern Design**: Clean, professional interface with cards and shadows
- **Intuitive Navigation**: Easy-to-use tabs and filters
- **Color-coded Status**: Visual indicators for stock levels
- **Modal Details**: Comprehensive product information in popup
- **Real-time Stats**: Dashboard showing inventory health
- **Pull-to-refresh**: Easy data updates
- **Grid/List Toggle**: Flexible viewing options
- **Thai Currency**: Proper formatting for prices

### 📂 Files Included
1. **server.js** - Express.js backend with inventory API
2. **inventory.tsx** - React Native inventory management screen
3. **inventory_products.json** - Product data in JSON format

### 🔗 API Endpoints
- Primary: `https://nindam.sytes.net/api/inventory`
- Fallback: `https://nindam.sytes.net/inventory_products.json`
- Local: Mock data as final fallback

### 🚀 Usage
1. Install dependencies: `npm install`
2. Start backend: `cd BACKEND && npm run dev`
3. Start frontend: `npm start`
4. Navigate to "Inventory" tab in the app

### 📊 Product Data Structure
Each inventory item includes:
- Basic info (name, SKU, barcode, category)
- Pricing (cost, selling price, profit margin)
- Stock levels (current, min, max)
- Location and supplier details
- Status and warranty information

### 🎨 UI Components
- Statistics cards at top
- Search bar with real-time filtering
- Category buttons for quick filtering
- Sort options (name, price, stock, date)
- Product cards with images and key info
- Detailed modal with complete information
- Color-coded stock status indicators

This system is designed for efficient inventory management with a focus on usability and visual clarity.
