-- SQL: Create FinalExam_Tanakit_Siriteerapan_Inventory
-- Prefix: 6630202261
-- Table follows naming rules required by the exam

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
('Product A', 20, 100.00, NULL),
('Product B', 3, 50.00, NULL),
('Product C', 10, 75.00, NULL),
('Product D', 2, 120.00, NULL),
('Product E', 8, 60.00, NULL),
('Product F', 15, 30.00, NULL),
('Product G', 0, 45.00, NULL),
('Product H', 6, 55.00, NULL),
('Product I', 4, 22.00, NULL),
('Product J', 12, 18.50, NULL),
('Product K', 9, 95.00, NULL),
('Product L', 11, 130.00, NULL),
('Product M', 7, 40.00, NULL),
('Product N', 14, 200.00, NULL),
('Product O', 1, 15.00, NULL),
('Product P', 5, 9.00, NULL),
('Product Q', 16, 19.00, NULL),
('Product R', 13, 25.00, NULL),
('Water (Final 19)', 50, 10.00, 'https://example.com/images/water.jpg');

-- If you need the ID to be exactly 19 regardless of existing rows, you can set AUTO_INCREMENT to 20 and insert with explicit ID 19.
-- Example (uncomment to force ID=19):
-- ALTER TABLE `FinalExam_Tanakit_Siriteerapan_Inventory` AUTO_INCREMENT = 20;
-- INSERT INTO `FinalExam_Tanakit_Siriteerapan_Inventory` (
--  `6630202261_ID_Product`, `6630202261_Name_Product`, `6630202261_Qty_Stock`, `6630202261_Price_Unit`, `6630202261_Img_Path`
-- ) VALUES (19, 'Water (Final 19)', 50, 10.00, 'https://example.com/images/water.jpg');
