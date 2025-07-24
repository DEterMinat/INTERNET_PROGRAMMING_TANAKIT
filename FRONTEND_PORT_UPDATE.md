# 🔧 เปลี่ยน PORT ของ Frontend เป็น 9785

## ✅ การเปลี่ยนแปลงที่ทำแล้ว

### 📝 ไฟล์ที่แก้ไข:

#### 1. `package.json` - อัปเดต scripts
```json
{
  "scripts": {
    "start": "npx expo start --port 9785",
    "web": "npx expo start --web --port 9785",
    "android": "npx expo start --android --port 9785",
    "ios": "npx expo start --ios --port 9785"
  }
}
```

#### 2. `.env` - สร้างไฟล์ใหม่
```env
EXPO_DEV_SERVER_PORT=9785
EXPO_BUNDLER_PORT=9785
WEB_PORT=9785
METRO_PORT=9785
```

#### 3. `app.json` - เพิ่ม web port config
```json
{
  "expo": {
    "web": {
      "port": 9785
    }
  }
}
```

## 🌐 URL ที่ใช้งานตอนนี้

### Frontend (Expo Web):
```
http://localhost:9785
```

### Backend API:
```
http://119.59.102.61:9785/api
```

## 🚀 คำสั่งรัน Frontend

### Web Application:
```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
```

### Mobile Development:
```bash
npm start           # Metro bundler บน port 9785
npm run android     # Android + Metro บน port 9785
npm run ios         # iOS + Metro บน port 9785
```

## 📱 ผลลัพธ์ที่คาดหวัง

### หลังรัน `npm run web`:
```
Starting Metro Bundler
Web Bundler is ready
Your app is available at: http://localhost:9785
```

### การเข้าถึง:
- **Local:** `http://localhost:9785`
- **Network:** `http://your-server-ip:9785`

## 🔍 การตรวจสอบ

### 1. ตรวจสอบ Metro Bundler:
```bash
netstat -tulpn | grep 9785
```

### 2. ตรวจสอบ Web App:
```bash
curl http://localhost:9785
```

### 3. Browser Developer Tools:
```
Network Tab → ดู requests ไปที่ port 9785
```

## ⚖️ Port Allocation

| Service | Port | URL |
|---------|------|-----|
| Frontend (Expo Web) | 9785 | http://localhost:9785 |
| Backend API | 9785 | http://119.59.102.61:9785/api |
| Metro Bundler | 9785 | http://localhost:9785 |

## ⚠️ หมายเหตุสำคัญ

1. **Port Conflict:** Frontend และ Backend ใช้ port เดียวกัน (9785)
   - Frontend: Local port 9785
   - Backend: Remote server 119.59.102.61:9785

2. **Firewall:** ต้องเปิด port 9785 บน server

3. **CORS:** Backend ต้องอนุญาต requests จาก Frontend domain

## 🔄 การแก้ปัญหา Port Conflict

หากมีปัญหา port ชน สามารถเปลี่ยน Frontend เป็น port อื่น:

### เปลี่ยนเป็น port 3000:
```bash
# แก้ไข package.json
"web": "npx expo start --web --port 3000"

# แก้ไข .env
WEB_PORT=3000

# แก้ไข app.json
"web": { "port": 3000 }
```

## 📋 การทดสอบ

### ขั้นตอนการทดสอบ:
1. รัน Frontend: `npm run web`
2. เปิด browser: `http://localhost:9785`
3. ตรวจสอบ API calls ใน Network tab
4. ยืนยันว่า calls ไปที่ `http://119.59.102.61:9785/api`

---

**สถานะปัจจุบัน:** ✅ เปลี่ยน Frontend PORT เป็น 9785 แล้ว
