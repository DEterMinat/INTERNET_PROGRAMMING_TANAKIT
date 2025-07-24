# Database Schema สำหรับระบบ Internet Programming

## ภาพรวมของฐานข้อมูล

ฐานข้อมูลนี้ออกแบบมาสำหรับระบบ E-commerce พื้นฐาน ประกอบด้วยตารางหลัก 8 ตาราง:

### 🗂️ ตารางหลัก

1. **users** - ข้อมูลผู้ใช้งาน
2. **categories** - หมวดหมู่สินค้า  
3. **products** - ข้อมูลสินค้า
4. **orders** - คำสั่งซื้อ
5. **order_items** - รายการสินค้าในคำสั่งซื้อ
6. **reviews** - รีวิวสินค้า
7. **cart** - ตะกร้าสินค้า
8. **wishlists** - รายการโปรด

## 📊 Schema Diagram

```
users (1) ----< orders (1) ----< order_items (n) >---- products (1)
  |                                                         |
  |----< reviews >--------------------------------------------|
  |                                                         |
  |----< cart >---------------------------------------------|
  |                                                         |
  |----< wishlists >----------------------------------------|
                                                            |
                                              categories ----< products
```

## 🚀 วิธีการติดตั้ง

### ขั้นตอนที่ 1: สร้างฐานข้อมูล
```sql
CREATE DATABASE internet_programming_db;
USE internet_programming_db;
```

### ขั้นตอนที่ 2: รันสคริปต์สร้างตาราง
ใช้ไฟล์ `complete_database_setup.sql` ที่รวมทุกอย่างไว้แล้ว:

```bash
mysql -u username -p database_name < complete_database_setup.sql
```

หรือรันทีละไฟล์:
1. `create_tables.sql` - สร้างตารางทั้งหมด
2. `insert_mock_data.sql` - เพิ่มข้อมูลจำลอง

## 📋 รายละเอียดตาราง

### 1. users (ผู้ใช้งาน)
| Field | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | รหัสผู้ใช้ (Primary Key) |
| username | VARCHAR(50) | ชื่อผู้ใช้ (ไม่ซ้ำ) |
| email | VARCHAR(100) | อีเมล (ไม่ซ้ำ) |
| password | VARCHAR(255) | รหัสผ่านที่เข้ารหัสแล้ว |
| firstName | VARCHAR(50) | ชื่อจริง |
| lastName | VARCHAR(50) | นามสกุล |
| avatar | VARCHAR(255) | รูปโปรไฟล์ |
| role | ENUM | บทบาท ('user', 'admin') |
| isActive | BOOLEAN | สถานะการใช้งาน |

### 2. products (สินค้า)
| Field | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | รหัสสินค้า (Primary Key) |
| name | VARCHAR(100) | ชื่อสินค้า |
| description | TEXT | รายละเอียดสินค้า |
| price | DECIMAL(10,2) | ราคาสินค้า |
| category | VARCHAR(50) | หมวดหมู่ |
| brand | VARCHAR(50) | ยี่ห้อ |
| image | VARCHAR(255) | รูปภาพสินค้า |
| stock | INT | จำนวนคงเหลือ |
| rating | DECIMAL(2,1) | คะแนนรีวิว |
| featured | BOOLEAN | สินค้าแนะนำ |

### 3. orders (คำสั่งซื้อ)
| Field | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | รหัสคำสั่งซื้อ |
| user_id | INT | รหัสผู้ใช้ (Foreign Key) |
| order_number | VARCHAR(20) | เลขที่คำสั่งซื้อ |
| total_amount | DECIMAL(10,2) | ยอดรวม |
| status | ENUM | สถานะคำสั่งซื้อ |
| payment_method | ENUM | วิธีการชำระเงิน |
| payment_status | ENUM | สถานะการชำระเงิน |

## 💾 ข้อมูลจำลอง (Mock Data)

### Users (5 records)
- admin (role: admin)
- john_doe, jane_smith, mike_wilson, sarah_brown (role: user)
- รหัสผ่านทั้งหมด: `password123`

### Categories (5 records)
- Electronics (อิเล็กทรอนิกส์)
- Fashion (แฟชั่น)
- Sports (กีฬา)
- Books (หนังสือ)
- Home & Garden (บ้านและสวน)

### Products (16 records)
- iPhone 15 Pro, Samsung Galaxy S24, MacBook Air M3
- เสื้อผ้า, รองเท้า, กระเป๋า
- อุปกรณ์กีฬา, หนังสือ, ของใช้ในบ้าน

### Orders (4 records)
- คำสั่งซื้อตัวอย่างพร้อมสถานะต่างๆ

## 🔍 Query ตัวอย่างที่มีประโยชน์

### แสดงสินค้าพร้อมจำนวนรีวิว
```sql
SELECT p.name, p.price, p.rating, COUNT(r.id) as review_count 
FROM products p 
LEFT JOIN reviews r ON p.id = r.product_id 
GROUP BY p.id 
ORDER BY p.rating DESC;
```

### แสดงคำสั่งซื้อพร้อมข้อมูลลูกค้า
```sql
SELECT o.order_number, u.firstName, u.lastName, o.total_amount, o.status
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```

### แสดงสินค้าที่ขายดีที่สุด
```sql
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;
```

### แสดงรายได้รายเดือน
```sql
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue
FROM orders 
WHERE status = 'delivered'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;
```

## 🔧 การบำรุงรักษา

### เพิ่ม Index เพื่อประสิทธิภาพ
สคริปต์มี indexes พื้นฐานแล้ว หากต้องการเพิ่มเติม:

```sql
-- Index สำหรับการค้นหาสินค้าตามชื่อ
CREATE INDEX idx_products_name ON products(name);

-- Index สำหรับการค้นหาตามวันที่
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### สำรองข้อมูล
```bash
mysqldump -u username -p database_name > backup.sql
```

## 📝 หมายเหตุ

1. รหัสผ่านในข้อมูลจำลองถูกเข้ารหัสด้วย bcrypt
2. ใช้ ENUM สำหรับ status fields เพื่อความถูกต้องของข้อมูล
3. มี Foreign Key Constraints เพื่อรักษาความสมบูรณ์ของข้อมูล
4. ใช้ TIMESTAMP พร้อม AUTO UPDATE สำหรับการติดตามการเปลี่ยนแปลง

## 🚨 คำเตือน

- ก่อนรันสคริปต์ DROP TABLE ให้สำรองข้อมูลก่อน
- ตรวจสอบ charset และ collation ให้รองรับภาษาไทย
- แนะนำให้ใช้ UTF8MB4 สำหรับการรองรับ emoji และตัวอักษรพิเศษ
