# 🚨 แก้ปัญหา "Cannot find module 'express'"

## ❌ ปัญหา

```
Error: Cannot find module 'express'
```

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND
npm install
```

### ขั้นตอนที่ 2: เริ่ม Backend Server

```bash
node server.js
```

## 📋 คำสั่งเต็ม (Copy & Paste)

```bash
# เข้า directory
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND

# ติดตั้ง packages (ใช้เวลา 1-2 นาที)
npm install

# เริ่ม server
node server.js
```

## 📦 สิ่งที่ npm install จะติดตั้ง

- express (Web framework)
- cors (Cross-origin requests)
- helmet (Security headers)
- morgan (Logging)
- dotenv (Environment variables)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT tokens)
- express-validator (Input validation)

## 🎯 ผลลัพธ์ที่คาดหวัง

### หลังรัน npm install

```
added 150+ packages, and audited 151 packages in 30s
found 0 vulnerabilities
```

### หลังรัน node server.js

```
📋 Using mock data mode (Database connection disabled)
🚀 Server running at http://localhost:9785
📖 API Documentation available at http://localhost:9785
🗄️  Database: Using mock data (DB connection disabled)
```

## 🔍 ตรวจสอบไฟล์ package.json

```bash
# ตรวจสอบว่ามีไฟล์ package.json หรือไม่
ls -la /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND/

# ดูเนื้อหา package.json
cat /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND/package.json
```

## ⚠️ หมายเหตุสำคัญ

- ต้องรัน `npm install` ใน BACKEND directory เท่านั้น
- การติดตั้งครั้งแรกใช้เวลานาน ครั้งต่อไปจะเร็วขึ้น
- หลังติดตั้งแล้วจะมีโฟลเดอร์ `node_modules` ขึ้นมา
