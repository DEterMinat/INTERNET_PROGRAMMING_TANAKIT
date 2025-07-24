# 🛠️ คำสั่งที่ถูกต้องสำหรับรัน Backend

## ❌ คำสั่งที่ผิด

```bash
node start  # ผิด! ไม่มีไฟล์ชื่อ 'start'
```

## ✅ คำสั่งที่ถูกต้อง

### สำหรับ Backend (Express API)

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND

# ⚠️ สำคัญ! ติดตั้ง dependencies ก่อน
npm install

# จากนั้นค่อยเริ่ม server
node server.js
```

### สำหรับ Frontend (Expo Web)

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
```

## 📁 โครงสร้างไฟล์

```
BACKEND/
├── server.js          # ← ไฟล์หลักของ Backend
├── package.json       # มี scripts สำหรับ npm
├── routes/
├── config/
└── ...

Root/
├── package.json       # ← มี expo scripts
├── app/
└── ...
```

## 🚀 การเริ่มต้นระบบทั้งหมด

### 1. เริ่ม Backend API

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND

# ⚠️ สำคัญ! ติดตั้ง dependencies ก่อน (ครั้งแรกเท่านั้น)
npm install

# จากนั้นเริ่ม server
node server.js
```

ผลลัพธ์ที่ควรเห็น:

```
📋 Using mock data mode (Database connection disabled)
🚀 Server running at http://localhost:9785
📖 API Documentation available at http://localhost:9785
🗄️  Database: Using mock data (DB connection disabled)
```

### 2. เริ่ม Frontend Web (Terminal ใหม่)

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
```

## 🔧 Alternative Commands

### ใช้ npm scripts (ถ้ามี)

```bash
# ใน BACKEND directory
npm start        # ถ้ามี script "start": "node server.js"
npm run dev      # ถ้ามี script dev

# ใน Root directory  
npm run web      # เริ่ม Expo web
npm start        # เริ่ม Expo mobile
```

## 📋 เช็คไฟล์ที่มีอยู่

```bash
# ตรวจสอบไฟล์ใน BACKEND
ls -la /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND/

# ควรเห็น server.js
```
