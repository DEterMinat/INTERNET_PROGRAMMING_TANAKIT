-- =========================================
-- Mock Data สำหรับระบบ Internet Programming
-- =========================================

-- Mock Data สำหรับตาราง categories
INSERT INTO categories (name, description, image, isActive) VALUES
('Electronics', 'อุปกรณ์อิเล็กทรอนิกส์และเทคโนโลยี', 'electronics.png', TRUE),
('Fashion', 'เสื้อผ้าและแฟชั่น', 'fashion.png', TRUE),
('Sports', 'อุปกรณ์กีฬาและออกกำลังกาย', 'sports.png', TRUE),
('Books', 'หนังสือและสื่อการเรียนรู้', 'books.png', TRUE),
('Home & Garden', 'ของใช้ในบ้านและสวน', 'home.png', TRUE);

-- Mock Data สำหรับตาราง users
INSERT INTO users (username, email, password, firstName, lastName, avatar, role, isActive) VALUES
('admin', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin-avatar.png', 'admin', TRUE),
('john_doe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'john-avatar.png', 'user', TRUE),
('jane_smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'jane-avatar.png', 'user', TRUE),
('mike_wilson', 'mike@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Wilson', 'mike-avatar.png', 'user', TRUE),
('sarah_brown', 'sarah@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Brown', 'sarah-avatar.png', 'user', TRUE);

-- Mock Data สำหรับตาราง products
INSERT INTO products (name, description, price, category, brand, image, stock, rating, featured, isActive) VALUES
-- Electronics
('iPhone 15 Pro', 'มือถือ iPhone รุ่นล่าสุด ดีไซน์สวย กล้องคมชัด', 45900.00, 'Electronics', 'Apple', 'iphone15.jpg', 25, 4.8, TRUE, TRUE),
('Samsung Galaxy S24', 'สมาร์ทโฟน Android ประสิทธิภาพสูง', 32900.00, 'Electronics', 'Samsung', 'galaxy-s24.jpg', 30, 4.7, TRUE, TRUE),
('MacBook Air M3', 'โน้ตบุ๊ค Apple ชิป M3 ประสิทธิภาพสูง', 42900.00, 'Electronics', 'Apple', 'macbook-air.jpg', 15, 4.9, TRUE, TRUE),
('AirPods Pro 2', 'หูฟังไร้สาย ตัดเสียงรบกวน', 8900.00, 'Electronics', 'Apple', 'airpods-pro.jpg', 50, 4.6, FALSE, TRUE),
('Sony WH-1000XM5', 'หูฟังครอบหู ตัดเสียงรบกวน', 12900.00, 'Electronics', 'Sony', 'sony-headphones.jpg', 20, 4.8, FALSE, TRUE),

-- Fashion
('เสื้อยืดผ้าฝ้าย Premium', 'เสื้อยืดคุณภาพสูง นุ่มสบาย', 590.00, 'Fashion', 'Uniqlo', 'cotton-tshirt.jpg', 100, 4.5, FALSE, TRUE),
('กางเกงยีนส์ Slim Fit', 'กางเกงยีนส์ทรงสวย ใส่สบาย', 1290.00, 'Fashion', 'Levi\'s', 'slim-jeans.jpg', 75, 4.4, FALSE, TRUE),
('รองเท้าผ้าใบ Running', 'รองเท้าวิ่ง น้ำหนักเบา', 2890.00, 'Fashion', 'Nike', 'running-shoes.jpg', 40, 4.7, TRUE, TRUE),
('กระเป๋าสะพาย Crossbody', 'กระเป๋าหนังแท้ ดีไซน์สวย', 1590.00, 'Fashion', 'Coach', 'crossbody-bag.jpg', 25, 4.6, FALSE, TRUE),

-- Sports
('ดัมเบล์ปรับน้ำหนัก 20kg', 'ดัมเบล์ปรับได้ สำหรับออกกำลังกาย', 3500.00, 'Sports', 'PowerTech', 'adjustable-dumbbell.jpg', 15, 4.5, FALSE, TRUE),
('เสื่อโยคะ Premium', 'เสื่อโยคะ หนา 8mm กันลื่น', 890.00, 'Sports', 'Manduka', 'yoga-mat.jpg', 60, 4.6, FALSE, TRUE),
('จักรยานออกกำลังกาย', 'จักรยานนั่งปั่น สำหรับในบ้าน', 12900.00, 'Sports', 'Life Fitness', 'exercise-bike.jpg', 8, 4.7, TRUE, TRUE),

-- Books
('หนังสือเรียนโปรแกรมมิ่ง JavaScript', 'เรียนรู้ JavaScript เบื้องต้นถึงขั้นสูง', 650.00, 'Books', 'O\'Reilly', 'javascript-book.jpg', 200, 4.8, TRUE, TRUE),
('นวนิยาย - ดาวเหนือ', 'นวนิยายไทยร่วมสมัย', 320.00, 'Books', 'มติชน', 'thai-novel.jpg', 150, 4.3, FALSE, TRUE),

-- Home & Garden
('หม้อข้าวไฟฟ้า 1.8L', 'หม้อหุงข้าวไฟฟ้า ความจุ 1.8 ลิตร', 2590.00, 'Home & Garden', 'Sharp', 'rice-cooker.jpg', 30, 4.5, FALSE, TRUE),
('เครื่องฟอกอากาศ HEPA', 'เครื่องฟอกอากาศ กรองฝุ่น PM2.5', 8900.00, 'Home & Garden', 'Xiaomi', 'air-purifier.jpg', 20, 4.7, TRUE, TRUE);

-- Mock Data สำหรับตาราง orders
INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, payment_method, payment_status, notes) VALUES
(2, 'ORD001', 45900.00, 'delivered', '123 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110', 'credit_card', 'paid', 'ส่งด่วน'),
(3, 'ORD002', 33790.00, 'shipped', '456 ถนนพหลโยธิน เขตจตุจักร กรุงเทพฯ 10900', 'bank_transfer', 'paid', ''),
(4, 'ORD003', 4180.00, 'confirmed', '789 ถนนรัชดาภิเษก เขตห้วยขวาง กรุงเทพฯ 10310', 'cash_on_delivery', 'pending', 'โทรก่อนส่ง'),
(5, 'ORD004', 15790.00, 'pending', '321 ถนนเพชรบุรี เขตราชเทวี กรุงเทพฯ 10400', 'credit_card', 'paid', '');

-- Mock Data สำหรับตาราง order_items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1
(1, 1, 1, 45900.00, 45900.00),
-- Order 2
(2, 2, 1, 32900.00, 32900.00),
(2, 6, 1, 590.00, 590.00),
(2, 10, 1, 300.00, 300.00),
-- Order 3
(3, 4, 1, 8900.00, 8900.00),
(3, 6, 2, 590.00, 1180.00),
(3, 11, 1, 890.00, 890.00),
-- Order 4
(4, 8, 1, 2890.00, 2890.00),
(4, 12, 1, 12900.00, 12900.00);

-- Mock Data สำหรับตาราง reviews
INSERT INTO reviews (user_id, product_id, rating, comment, is_verified_purchase) VALUES
(2, 1, 5, 'สินค้าดีมาก ใช้งานลื่น กล้องชัดมาก แนะนำเลยครับ', TRUE),
(3, 2, 4, 'โทรศัพท์ดี แต่แบตหมดเร็วนิดหน่อย', TRUE),
(4, 4, 5, 'เสียงดีมาก ตัดเสียงรบกวนได้ดี คุ้มค่าเงิน', TRUE),
(5, 8, 4, 'รองเท้าสวย ใส่สบาย แต่ขนาดเล็กไปนิดหน่อย', TRUE),
(2, 13, 5, 'หนังสือดี เข้าใจง่าย มีตัวอย่างเยอะ', TRUE),
(3, 6, 4, 'เสื้อนุ่มดี แต่สีจางไปนิดหน่อยหลังซัก', TRUE);

-- Mock Data สำหรับตาราง cart
INSERT INTO cart (user_id, product_id, quantity) VALUES
(2, 3, 1),
(2, 5, 1),
(3, 7, 2),
(3, 11, 1),
(4, 14, 1),
(5, 9, 1);

-- Mock Data สำหรับตาราง wishlists
INSERT INTO wishlists (user_id, product_id) VALUES
(2, 12),
(2, 15),
(3, 1),
(3, 3),
(4, 5),
(4, 8),
(5, 13),
(5, 14);
