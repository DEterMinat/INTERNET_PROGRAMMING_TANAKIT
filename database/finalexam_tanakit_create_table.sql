-- SQL: Create FinalExam_Tanakit_Siriteerapan_Inventory
-- Prefix: 6630202261
-- Table follows naming rules required by the exam

-- Select the database first
USE `it_std6630202261`;

CREATE TABLE IF NOT EXISTS `FinalExam_Tanakit_Siriteerapan_Inventory` (
  `6630202261_ID_Product` INT NOT NULL AUTO_INCREMENT,
  `6630202261_Name_Product` VARCHAR(150) NOT NULL,
  `6630202261_Qty_Stock` INT NOT NULL DEFAULT 0,
  `6630202261_Price_Unit` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `6630202261_Img_Path` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`6630202261_ID_Product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (ensure ID 19 is Water)
-- We'll insert multiple sample rows so that ID 19 becomes water; if the table is empty the AUTO_INCREMENT will start from 1.

INSERT INTO `FinalExam_Tanakit_Siriteerapan_Inventory` 
  (`6630202261_Name_Product`, `6630202261_Qty_Stock`, `6630202261_Price_Unit`, `6630202261_Img_Path`) VALUES
('Laptop Computer', 20, 25900.00, NULL),
('Wireless Mouse', 3, 450.00, NULL),
('USB Cable Type-C', 10, 150.00, NULL),
('Keyboard Mechanical', 2, 1200.00, NULL),
('Monitor 24 inch', 8, 4500.00, NULL),
('Headphone Gaming', 15, 890.00, NULL),
('Webcam HD', 0, 1250.00, NULL),
('Laptop Stand', 6, 550.00, NULL),
('Phone Charger', 4, 220.00, NULL),
('Power Bank 20000mAh', 12, 890.00, NULL),
('HDMI Cable 2m', 9, 195.00, NULL),
('SSD 1TB', 11, 2300.00, NULL),
('RAM DDR4 16GB', 7, 1800.00, NULL),
('CPU Cooler', 14, 850.00, NULL),
('Graphics Card', 1, 15900.00, NULL),
('Motherboard', 5, 4500.00, NULL),
('PC Case', 16, 1900.00, NULL),
('Fan RGB 120mm', 13, 250.00, NULL),
('Water Bottle 1L', 50, 10.00, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400');

-- Note: The last row (ID 19) will be "Water Bottle 1L" with 50 quantity and 10 baht price
