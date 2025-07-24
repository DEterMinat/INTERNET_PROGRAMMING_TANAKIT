# 🔧 Port Configuration Best Practices

## ❓ คำถาม: Frontend กับ Backend ควรใช้ port เดียวกันหรือไม่?

### ❌ **ไม่ควร!** เพราะจะเกิดปัญหา Port Conflict

## ✅ **การตั้งค่า Port ที่แนะนำ**

### 🎯 **Port Allocation ใหม่:**

| Service | Port | URL | การใช้งาน |
|---------|------|-----|-----------|
| **Frontend (Expo Web)** | 3000 | http://localhost:3000 | พัฒนา Frontend |
| **Backend API** | 9785 | http://119.59.102.61:9785/api | API Server |
| **Metro Bundler** | 3000 | http://localhost:3000 | Expo Development |

## 🔄 **การเปลี่ยนแปลงที่ทำแล้ว:**

### 1. `package.json` - เปลี่ยนเป็น port 3000:
```json
{
  "scripts": {
    "web": "npx expo start --web --port 3000",
    "start": "npx expo start --port 3000"
  }
}
```

### 2. `.env` - อัปเดต port config:
```env
EXPO_DEV_SERVER_PORT=3000
WEB_PORT=3000
METRO_PORT=3000
```

### 3. `app.json` - เปลี่ยน web port:
```json
{
  "expo": {
    "web": {
      "port": 3000
    }
  }
}
```

## 🌐 **URL ที่ใช้งานตอนนี้:**

### Frontend Development:
```
http://localhost:3000
```

### Backend API:
```
http://119.59.102.61:9785/api
```

## 🚀 **วิธีรันระบบทั้งหมด:**

### Terminal 1 - Frontend:
```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
# ผลลัพธ์: Frontend รันที่ http://localhost:3000
```

### Terminal 2 - Backend:
```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT/BACKEND
node server.js
# ผลลัพธ์: Backend รันที่ http://localhost:9785
```

## 💡 **ข้อดีของการแยก Port:**

### ✅ **ไม่มี Port Conflict**
- Frontend และ Backend รันพร้อมกันได้
- ไม่มีปัญหาการชนกันของ port

### ✅ **ง่ายต่อการ Debug**
- แยกแยะได้ชัดเจนว่า request มาจากไหน
- ตรวจสอบ logs แต่ละ service ได้ง่าย

### ✅ **ตรงตาม Convention**
- Port 3000: Frontend development standard
- Port 9785: Backend API custom port

## 🔍 **การทดสอบ:**

### 1. ทดสอบ Frontend:
```bash
curl http://localhost:3000
```

### 2. ทดสอบ Backend:
```bash
curl http://119.59.102.61:9785/health
curl http://119.59.102.61:9785/api/products
```

### 3. ทดสอบ API Integration:
เปิด Frontend ที่ `http://localhost:3000` และดู Network tab ใน Developer Tools จะเห็น requests ไปที่ `http://119.59.102.61:9785/api`

## 📋 **Development Workflow:**

### สำหรับ Local Development:
```bash
# Terminal 1: Backend
cd BACKEND
npm install  # ครั้งแรกเท่านั้น
node server.js

# Terminal 2: Frontend
cd /
npm run web
```

### สำหรับ Production:
- Frontend: Deploy static files หรือ hosting
- Backend: Deploy บน server 119.59.102.61:9785

## ⚠️ **หมายเหตุสำคัญ:**

1. **CORS Configuration:** Backend ต้องอนุญาต requests จาก `http://localhost:3000`
2. **Environment Detection:** API จะใช้ production URL `http://119.59.102.61:9785/api`
3. **Port Availability:** ตรวจสอบว่า port 3000 และ 9785 ว่าง

---

**สถานะปัจจุบัน:** ✅ แยก Port แล้ว - Frontend: 3000, Backend: 9785
