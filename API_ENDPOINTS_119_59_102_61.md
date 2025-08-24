# API Endpoints Configuration - Updated for 119.59.102.61:9785

## 🌐 **Base URL**
```
http://119.59.102.61:9785
```

## 📡 **API Endpoints**

### Health & Status
```http
GET http://119.59.102.61:9785/health
GET http://119.59.102.61:9785/
```

### Products (Database API)
```http
GET http://119.59.102.61:9785/api/db-products
GET http://119.59.102.61:9785/api/db-products/:id
GET http://119.59.102.61:9785/api/db-products/statistics
GET http://119.59.102.61:9785/api/db-products/categories
GET http://119.59.102.61:9785/api/db-products/featured
```

### Inventory Management
```http
GET http://119.59.102.61:9785/api/inventory
GET http://119.59.102.61:9785/api/inventory/:id
GET http://119.59.102.61:9785/api/inventory/categories
GET http://119.59.102.61:9785/api/inventory/stats
GET http://119.59.102.61:9785/api/inventory/search?q=keyword
GET http://119.59.102.61:9785/api/inventory/low-stock
```

### Dashboard & Analytics
```http
GET http://119.59.102.61:9785/api/dashboard
GET http://119.59.102.61:9785/api/dashboard/sales
GET http://119.59.102.61:9785/api/dashboard/analytics
GET http://119.59.102.61:9785/api/dashboard/reports
```

### Authentication
```http
POST http://119.59.102.61:9785/api/auth/register
POST http://119.59.102.61:9785/api/auth/login
POST http://119.59.102.61:9785/api/auth/logout
GET  http://119.59.102.61:9785/api/auth/profile
GET  http://119.59.102.61:9785/api/auth/verify
```

### Users Management
```http
GET  http://119.59.102.61:9785/api/users
GET  http://119.59.102.61:9785/api/users/:id
GET  http://119.59.102.61:9785/api/users/public?limit=10
GET  http://119.59.102.61:9785/api/users/profile
```

---

## 🔧 **Configuration Updates**

### Frontend (config/environment.ts)
```typescript
baseUrls: {
  development: 'http://119.59.102.61:9785',
  staging: 'http://119.59.102.61:9785',
  production: 'http://119.59.102.61:9785'
}
```

### Backend (BACKEND/.env)
```properties
API_BASE_URL=http://119.59.102.61:9785
PORT=9785
CORS_ORIGIN=http://119.59.102.61:30019
```

### Backend (server.js)
```javascript
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://119.59.102.61:${port}`);
});
```

---

## 🚀 **การเริ่มใช้งาน**

### 1. Start Backend Server
```bash
cd BACKEND
npm start
# หรือ
./start-server.sh
```

### 2. Test API Endpoints
```bash
# Health Check
curl http://119.59.102.61:9785/health

# Products List
curl http://119.59.102.61:9785/api/db-products

# Inventory Data
curl http://119.59.102.61:9785/api/inventory
```

### 3. Start Frontend
```bash
# Frontend จะเชื่อมต่อ API อัตโนมัติ
npm start
```

---

## ✅ **Expected Results**

### Frontend:
- เชื่อมต่อ `http://119.59.102.61:9785` สำเร็จ
- ไม่มี CORS errors
- ดึงข้อมูลจาก Database API ได้

### Backend:
- รันบน `0.0.0.0:9785` (accessible from 119.59.102.61)
- รองรับ CORS สำหรับ Frontend
- เชื่อมต่อ MySQL Database

### API Testing:
- Health check: ✅ OK
- Products API: ✅ Data from Database
- Inventory API: ✅ Real data
- Authentication: ✅ JWT working

---

**API Base URL: `http://119.59.102.61:9785` 🎯**
