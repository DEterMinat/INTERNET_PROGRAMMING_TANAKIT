-- =========================================
-- Database Export for Final Task Submission
-- Student ID: std6630202261
-- Date: September 30, 2025
-- =========================================

-- This file combines the complete database schema and sample data
-- for the Internet Programming Final Assignment

-- =========================================
-- 1. DATABASE CREATION
-- =========================================

CREATE DATABASE IF NOT EXISTS `it_std6630202261` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `it_std6630202261`;

-- =========================================
-- 2. TABLE STRUCTURES
-- =========================================

-- Table: users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT '',
  `role` enum('user','admin') DEFAULT 'user',
  `isActive` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `featured` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_brand` (`brand`),
  KEY `idx_featured` (`featured`),
  KEY `idx_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 3. SAMPLE DATA INSERTION
-- =========================================

-- Insert sample categories
INSERT INTO `categories` (`name`, `description`, `isActive`) VALUES
('อิเล็กทรอนิกส์', 'อุปกรณ์อิเล็กทรอนิกส์และเทคโนโลยี', 1),
('อุปกรณ์คอมพิวเตอร์', 'คอมพิวเตอร์และอุปกรณ์ต่อพ่วง', 1),
('เครื่องใช้ไฟฟ้า', 'เครื่องใช้ไฟฟ้าในบ้าน', 1),
('เครื่องมือ', 'เครื่องมือช่างและอุปกรณ์', 1),
('อื่นๆ', 'สินค้าอื่นๆ', 1);

-- Insert sample products
INSERT INTO `products` (`name`, `description`, `price`, `category`, `brand`, `stock`, `rating`, `featured`, `isActive`) VALUES
('iPhone 15 Pro', 'สมาร์ทโฟน Apple รุ่นใหม่ล่าสุด', 39900.00, 'อิเล็กทรอนิกส์', 'Apple', 50, 4.8, 1, 1),
('Samsung Galaxy S24', 'สมาร์ทโฟน Samsung flagship', 29900.00, 'อิเล็กทรอนิกส์', 'Samsung', 30, 4.6, 1, 1),
('MacBook Pro M3', 'แล็ปท็อป Apple สำหรับงานหน้าที่', 89900.00, 'อุปกรณ์คอมพิวเตอร์', 'Apple', 15, 4.9, 1, 1),
('Dell XPS 13', 'แล็ปท็อปพกพาสำหรับงาน', 45900.00, 'อุปกรณ์คอมพิวเตอร์', 'Dell', 25, 4.4, 0, 1),
('Dyson V15 Detect', 'เครื่องดูดฝุ่นไร้สาย', 25900.00, 'เครื่องใช้ไฟฟ้า', 'Dyson', 20, 4.7, 1, 1),
('Xiaomi Air Purifier', 'เครื่องฟอกอากาศ', 8900.00, 'เครื่องใช้ไฟฟ้า', 'Xiaomi', 40, 4.3, 0, 1),
('Bosch Power Drill', 'สว่านไฟฟ้า พร้อมแบตเตอรี่', 3500.00, 'เครื่องมือ', 'Bosch', 60, 4.5, 0, 1),
('Sony WH-1000XM5', 'หูฟังตัดเสียงรบกวน', 12900.00, 'อิเล็กทรอนิกส์', 'Sony', 35, 4.8, 1, 1),
('iPad Air M2', 'แท็บเล็ต Apple สำหรับงานสร้างสรรค์', 24900.00, 'อิเล็กทรอนิกส์', 'Apple', 45, 4.6, 1, 1),
('Nintendo Switch OLED', 'เกมคอนโซลพกพา', 13900.00, 'อิเล็กทรอนิกส์', 'Nintendo', 25, 4.7, 1, 1);

-- Insert sample users (for testing)
INSERT INTO `users` (`username`, `email`, `password`, `firstName`, `lastName`, `role`, `isActive`) VALUES
('admin', 'admin@example.com', '$2b$10$example.hash.here', 'Admin', 'User', 'admin', 1),
('tanakit', 'tanakit@ku.th', '$2b$10$example.hash.here', 'Tanakit', 'Student', 'user', 1),
('testuser', 'test@example.com', '$2b$10$example.hash.here', 'Test', 'User', 'user', 1);

-- =========================================
-- 4. FINAL NOTES
-- =========================================
-- This database schema supports:
-- ✅ Complete product management (CRUD operations)
-- ✅ User authentication and authorization
-- ✅ Category management
-- ✅ Search and filtering capabilities
-- ✅ JSON API responses
-- ✅ Mobile frontend integration
-- ✅ Cloud deployment ready

-- Export completed for std6630202261
-- Date: 2025-09-30
-- =========================================