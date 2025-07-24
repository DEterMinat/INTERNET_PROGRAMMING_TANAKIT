# การเปลี่ยนแปลง API Configuration

## สิ่งที่เปลี่ยนแปลง

### 1. เปลี่ยน API Base URL
- **เดิม**: `http://localhost:9785/api`
- **ใหม่**: `http://nindam.sytes.net/api` (Production Server)

### 2. สร้าง Environment Configuration
- เพิ่มไฟล์ `config/environment.ts` สำหรับจัดการ environment
- รองรับการเปลี่ยนแปลงระหว่าง development และ production แบบอัตโนมัติ

### 3. ปรับปรุง Error Handling
- เพิ่ม error handling ที่ดีขึ้นสำหรับ network errors
- แสดง error messages ที่เหมาะสมสำหรับแต่ละสถานการณ์
- รองรับ development และ production error messages

### 4. อัปเดต Documentation
- อัปเดต README.md ให้สะท้อน production deployment
- เพิ่มข้อมูล production endpoints
- อัปเดต curl examples สำหรับ production server

## ไฟล์ที่แก้ไข

1. `services/api.ts` - เปลี่ยน API base URL และ error handling
2. `config/environment.ts` - เพิ่ม environment configuration
3. `BACKEND/README.md` - อัปเดต documentation

## การใช้งาน

### Development Mode
```typescript
// จะใช้ localhost automatically
const API_BASE_URL = 'http://localhost:9785/api'
```

### Production Mode
```typescript
// จะใช้ production server automatically
const API_BASE_URL = 'http://nindam.sytes.net/api'
```

## การตั้งค่า Environment

### Development
```bash
NODE_ENV=development
```

### Production
```bash
NODE_ENV=production
```

## หมายเหตุ

- ในขณะนี้ production server ยังไม่ได้ตั้งค่าเรียบร้อย (ได้รับ 404 error)
- แนะนำให้ตรวจสอบการตั้งค่า server และ endpoints บน production
- Frontend จะ fallback ไปยัง localhost หากไม่สามารถเชื่อมต่อ production ได้

## คำแนะนำ Production Server

1. ตรวจสอบให้แน่ใจว่า server รันอยู่บน port ที่ถูกต้อง
2. ตั้งค่า CORS ให้รองรับ frontend domain
3. ตรวจสอบ SSL/TLS certificate หากจำเป็น
4. ตั้งค่า environment variables ที่จำเป็น
