# Database Connection Guide

## การตั้งค่า Database

### 1. Environment Variables
สร้างไฟล์ `.env` และกำหนดค่าต่างๆ:

```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

### 2. การทดสอบการเชื่อมต่อ Database

```bash
# ทดสอบการเชื่อมต่อ Database
npm run test-db

# หรือ
npm run db:test
```

### 3. การเริ่มต้นเซิร์ฟเวอร์

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## โครงสร้าง Database

### ตาราง Products
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    image VARCHAR(500),
    stock INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ตาราง Users
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Health Check
- `GET /health` - ตรวจสอบสถานะเซิร์ฟเวอร์และ Database

### Products
- `GET /api/db-products` - ดึงข้อมูลสินค้าทั้งหมด
- `GET /api/db-products/:id` - ดึงข้อมูลสินค้าตาม ID
- `GET /api/db-products/statistics` - สtatิสติกสินค้า

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ข้อมูลผู้ใช้

### Users Management
- `GET /api/users` - รายการผู้ใช้ทั้งหมด
- `GET /api/users/:id` - ข้อมูลผู้ใช้ตาม ID

## Error Handling

หากการเชื่อมต่อ Database ล้มเหลว เซิร์ฟเวอร์จะ:
1. แสดงข้อความ error ใน console
2. ส่ง HTTP 500 error กลับไปยัง client
3. ไม่มี fallback เป็น mock data (เพื่อความชัดเจนในการพัฒนา)

## Deployment

### Local Development
1. ติดตั้ง MySQL บนเครื่อง
2. สร้าง database และ tables ตามโครงสร้างด้านบน
3. ตั้งค่า `.env` ให้ถูกต้อง
4. รันคำสั่ง `npm run dev`

### Production
1. อัปโหลดไฟล์ไปยัง server
2. ตั้งค่า `.env` ให้ใช้ค่าของ production database
3. รันคำสั่ง `npm start`

## การแก้ไขปัญหาทั่วไป

### Connection Timeout
- ตรวจสอบว่า MySQL service ทำงานอยู่
- ตรวจสอบ firewall settings
- เพิ่มค่า `acquireTimeout` ใน database config

### Access Denied
- ตรวจสอบ username และ password
- ตรวจสอบสิทธิ์การเข้าถึงของ user
- ตรวจสอบการตั้งค่า MySQL user permissions

### Table Not Found
- ตรวจสอบชื่อ database ใน `.env`
- สร้าง tables ตามโครงสร้างที่กำหนด
- รันคำสั่ง `npm run test-db` เพื่อตรวจสอบ
