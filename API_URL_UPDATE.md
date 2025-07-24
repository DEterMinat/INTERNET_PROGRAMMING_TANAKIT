# 🔄 อัปเดต API Base URL เป็น Production Server

## ✅ การเปลี่ยนแปลงที่ทำแล้ว

### 📝 ไฟล์ที่แก้ไข: `config/environment.ts`

**เปลี่ยนจาก:**

```typescript
production: 'http://nindam.sytes.net/api'
```

**เป็น:**

```typescript
production: 'http://119.59.102.61:9785/api'
```

## 🌐 URL ที่ใช้งานตอนนี้

### Development Mode (ใช้เมื่อทดสอบ local)

```
http://localhost:9785/api
```

### Production Mode (ใช้เมื่อ deploy จริง)

```
http://119.59.102.61:9785/api
```

## 🔧 การทำงานของระบบ

### แบบ Dynamic Detection

- ระบบจะตรวจสอบ `process.env.NODE_ENV` อัตโนมัติ
- ถ้า development → ใช้ localhost
- ถ้า production → ใช้ 119.59.102.61

### API Endpoints ที่ Frontend จะเรียกใช้

```
GET  http://119.59.102.61:9785/api/products
GET  http://119.59.102.61:9785/api/users/public
POST http://119.59.102.61:9785/api/auth/login
POST http://119.59.102.61:9785/api/auth/register
```

## 📱 การทดสอบ

### 1. ตรวจสอบ Backend Server บน 119.59.102.61

```bash
curl http://119.59.102.61:9785/health
```

### 2. ตรวจสอบ API Products

```bash
curl http://119.59.102.61:9785/api/products
```

### 3. ตรวจสอบ API Users

```bash
curl http://119.59.102.61:9785/api/users/public
```

## 🚀 การ Deploy Frontend

### Expo Web (Production)

```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
```

### React Native App

ต้องสร้าง build ใหม่เพราะ config เปลี่ยน:

```bash
npx expo build:web
```

## 🔍 การตรวจสอบการทำงาน

### ใน Browser Developer Tools จะเห็น

```
Network Tab → API calls ไปที่ http://119.59.102.61:9785/api/*
```

### ใน Console

```javascript
// ตรวจสอบ current API URL
console.log(config.api.baseUrl);
// ผลลัพธ์: "http://119.59.102.61:9785/api"
```

## ⚠️ หมายเหตุสำคัญ

1. **Backend Server ต้องรันบน 119.59.102.61:9785**
2. **CORS ต้องอนุญาต Frontend domain**
3. **Firewall ต้องเปิด port 9785**
4. **SSL Certificate (ถ้าต้องการ HTTPS)**

## 🔄 การย้อนกลับ (ถ้าจำเป็น)

หากต้องการใช้ server เดิม ให้แก้ไขกลับเป็น:

```typescript
production: 'http://nindam.sytes.net/api'
```

---

**สถานะปัจจุบัน:** ✅ อัปเดต API URL เป็น `http://119.59.102.61:9785/api` แล้ว
