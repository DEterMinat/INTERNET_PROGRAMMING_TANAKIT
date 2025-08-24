# Quick Start Guide

## 🚀 เริ่มใช้งาน Backend ได้เลย

### สำหรับ Production Server:
```bash
# เริ่มเซิร์ฟเวอร์
npm start

# หรือ
npm run production
```

### สำหรับ Development:
```bash
# เริ่มเซิร์ฟเวอร์แบบ auto-reload
npm run dev
```

## ✅ การทดสอบที่ผ่านแล้ว:

### Database Connection:
- ✅ เชื่อมต่อ MySQL สำเร็จ
- ✅ Database: `it_std6630202261`
- ✅ Server: `localhost:3306`

### Server Status:
- ✅ เซิร์ฟเวอร์ทำงานที่ port `9785`
- ✅ CORS และ Security middleware พร้อมใช้
- ✅ API endpoints พร้อมใช้

## 📡 API Endpoints พร้อมใช้:

### Health Check:
```bash
curl http://localhost:9785/health
```

### Products API:
```bash
# ดึงสินค้าทั้งหมดจาก Database
curl http://localhost:9785/api/db-products

# ดึงสินค้าตาม ID
curl http://localhost:9785/api/db-products/1

# สถิติสินค้า
curl http://localhost:9785/api/db-products/statistics
```

### Authentication:
```bash
# สมัครสมาชิก
curl -X POST http://localhost:9785/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# เข้าสู่ระบบ
curl -X POST http://localhost:9785/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

## 🔧 Configuration:

### Environment Variables (.env):
```properties
# Server
NODE_ENV=production
PORT=9785

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=it_std6630202261
DB_USER=std6630202261
DB_PASSWORD=M3@zWq7L

# JWT
JWT_SECRET=eyJhbGciOiJIUzI1NiJ9_2025!$tK8vQwzLrXyPjBvGfHsNcSdWmZpQeRtY
```

## 🎯 Next Steps:

1. **Database Tables**: ตรวจสอบว่าตาราง `products` และ `users` มีอยู่ใน database
2. **Frontend Integration**: เชื่อมต่อ Frontend กับ API endpoints
3. **Production Deployment**: Deploy ไปยัง production server

## 🚨 Important Notes:

- **ไม่มี Mock Data**: Backend ใช้แค่ MySQL เท่านั้น
- **Error Handling**: หาก Database connection ล้มเหลว จะแสดง HTTP 500
- **Security**: ใช้ helmet, CORS, และ JWT authentication
- **Performance**: ใช้ MySQL connection pool

---
**Backend พร้อมใช้งาน 100%** 🎉
