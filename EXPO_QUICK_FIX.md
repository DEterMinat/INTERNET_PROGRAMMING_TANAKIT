## 🚀 วิธีแก้ปัญหา "expo: not found"

### ✅ แก้ไขแล้ว: อัปเดต package.json 
ไฟล์ `package.json` ได้รับการอัปเดตให้ใช้ `npx expo` แทน `expo` แล้ว

### 📋 คำสั่งที่แนะนำให้ใช้:

```bash
# รัน web app
npm run web

# หรือใช้ npx โดยตรง
npx expo start --web

# สำหรับ mobile
npm run android
npm run ios
npm start
```

### 🔍 ตรวจสอบการทำงาน:

ลองรันคำสั่งนี้บน server:
```bash
cd /var/www/html/std6630202261/INTERNET_PROGRAMMING_TANAKIT
npm run web
```

### 📱 ผลลัพธ์ที่ควรเห็น:
```
Starting Metro Bundler
Web Bundler is ready
```

### 🌐 เข้าถึง Web App:
เมื่อรันสำเร็จ สามารถเข้าถึงได้ที่:
- `http://localhost:19006` (local)
- `http://your-server-ip:19006` (remote)

### 💡 หมายเหตุ:
- ใช้ `npx` จะช่วยหลีกเลี่ยงปัญหา global installation
- Expo CLI จะถูกดาวน์โหลดและใช้งานจาก cache ของ npm
- ไม่ต้องติดตั้ง expo globally อีกต่อไป
