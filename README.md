# Internet Programming - Final Assignment 📱
**Product Management System**

Student ID: std6630202261  
Student Name: TANAKIT  
Subject: Internet Programming  

## 🎯 Project Overview

This is a complete **Product Management System** built with **React Native** (frontend) and **Express.js/Node.js** (backend), connected to a **MySQL database** hosted on the cloud server `nindam.sytes.net`.

### ✨ Features
- ✅ **Show** products and inventory
- ✅ **Insert** new products  
- ✅ **Edit** existing products
- ✅ **Delete** products
- ✅ **Search** and filter products
- ✅ User authentication
- ✅ Responsive mobile interface

## 🛠️ Technology Stack

### Frontend
- **React Native** with Expo
- **TypeScript**
- **Expo Router** for navigation
- **React Native components**

### Backend  
- **Express.js** 
- **Node.js**
- **MySQL2** for database connectivity
- **JSON Web Tokens (JWT)** for authentication
- **CORS** enabled for cross-origin requests

### Database
- **MySQL** hosted on `nindam.sytes.net`
- Complete database schema with relations
- Sample data included

## 🚀 Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start --port 30019
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies  
npm install

# Start the backend server
npm run dev
# OR for production
npm start
```

### 3. Database Setup

The database is already configured and hosted on:
- **Host**: nindam.sytes.net
- **Database**: it_std6630202261
- **User**: std6630202261

## 📱 Mobile App Features

### ✅ Stock Inventory App (Final Exam Requirements)

1. **Add Product** ✅
   - Input product data (name, category, price, stock, brand, description)
   - Upload image (URL input)
   - Form validation and error handling

2. **Edit Product** ✅
   - Update existing product data
   - Pre-filled form with current data
   - Real-time updates

3. **Delete Product** ✅
   - Remove product from stock
   - Confirmation dialog before deletion
   - Cascade delete handling

4. **Show Products** ✅
   - Display all product list
   - Grid/Card view with product details
   - Pagination support
   - Real-time data refresh

5. **Search** ✅
   - Find products by name or keyword
   - Filter by category
   - Search by brand
   - Real-time search results

6. **Low Stock Alert** ✅
   - Highlight products where **stock < 5**
   - Visual warning indicators (red color)
   - Low stock counter in dashboard
   - Status badge on product cards

### 📊 Dashboard Statistics
- Total products count
- Total stock value
- Low stock items (stock < 5)
- Category distribution

## 🎓 Final-Term Exam Ready

**Exam Date**: Thursday, October 16, 2025  
**Time Limit**: 2:30 Hours  
**Format**: Practical + Written

### Technology Stack ✅
- ✅ Frontend: React Native (Mobile App)
- ✅ Backend: Express.js + Node.js
- ✅ Database: MySQL on nindam.sytes.net

### All Required Features ✅
- ✅ Add Product
- ✅ Edit Product
- ✅ Delete Product
- ✅ Show Products
- ✅ Search
- ✅ Low Stock Alert (stock < 5)

## 🚀 Quick Start for Exam

### Start Frontend
```bash
npm install
npx expo start --port 30019
```

### Start Backend
```bash
cd BACKEND
npm install
npm run dev
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory
- `DELETE /api/inventory/:id` - Delete inventory item

### Database
- **Host**: nindam.sytes.net
- **Database**: it_std6630202261
- **Port**: 3306

## 🧾 Final Exam Table (Tanakit)

A dedicated table for the final exam is available:

- **Table name:** `FinalExam_Tanakit_Siriteerapan_Inventory`
- **Prefix:** `6630202261`
- **Fields:**
  - `6630202261_ID_Product` (PRIMARY KEY)
  - `6630202261_Name_Product`
  - `6630202261_Qty_Stock`
  - `6630202261_Price_Unit`
  - `6630202261_Img_Path`

### API endpoints
- `GET /api/final-inventory` - list all final-exam items
- `GET /api/final-inventory/:id` - get single item
- `POST /api/final-inventory` - create item (body: { name, qty, price, img })
- `PUT /api/final-inventory/:id` - update item
- `DELETE /api/final-inventory/:id` - delete item

You can test this route using the example frontend screen at `app/(tabs)/final-inventory.tsx`.

## 📝 Notes

- User Login is NOT required for the exam
- Low Stock Alert triggers when stock < 5
- All data is stored in MySQL cloud database
- JSON format for all API requests/responses

---

**Student ID**: std6630202261  
**Ready for Final-Term Exam** ✅
