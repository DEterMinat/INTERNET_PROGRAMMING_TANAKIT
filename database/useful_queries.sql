-- =========================================
-- Useful Queries สำหรับระบบ Internet Programming
-- =========================================

-- =========================================
-- PRODUCT QUERIES (การจัดการสินค้า)
-- =========================================

-- แสดงสินค้าทั้งหมดพร้อมข้อมูลเบื้องต้น
SELECT 
    id,
    name,
    price,
    category,
    brand,
    stock,
    rating,
    featured,
    created_at
FROM products 
WHERE isActive = TRUE
ORDER BY created_at DESC;

-- แสดงสินค้าตามหมวดหมู่
SELECT * FROM products 
WHERE category = 'Electronics' AND isActive = TRUE
ORDER BY rating DESC;

-- แสดงสินค้าแนะนำ (Featured Products)
SELECT * FROM products 
WHERE featured = TRUE AND isActive = TRUE AND stock > 0
ORDER BY rating DESC;

-- แสดงสินค้าที่มีรีวิวมากที่สุด
SELECT 
    p.id,
    p.name,
    p.price,
    p.rating,
    COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.isActive = TRUE
GROUP BY p.id
ORDER BY review_count DESC, p.rating DESC
LIMIT 10;

-- แสดงสินค้าที่กำลังจะหมด (stock น้อย)
SELECT 
    name,
    stock,
    category,
    price
FROM products 
WHERE stock <= 10 AND isActive = TRUE
ORDER BY stock ASC;

-- =========================================
-- USER & AUTHENTICATION QUERIES
-- =========================================

-- ตรวจสอบข้อมูลผู้ใช้สำหรับการ login
SELECT 
    id,
    username,
    email,
    password,
    firstName,
    lastName,
    role,
    isActive
FROM users 
WHERE (username = 'john_doe' OR email = 'john@example.com') 
AND isActive = TRUE;

-- แสดงผู้ใช้ใหม่ล่าสุด
SELECT 
    username,
    firstName,
    lastName,
    email,
    created_at
FROM users 
WHERE role = 'user' AND isActive = TRUE
ORDER BY created_at DESC
LIMIT 10;

-- นับจำนวนผู้ใช้งานทั้งหมด
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
    SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count
FROM users 
WHERE isActive = TRUE;

-- =========================================
-- ORDER MANAGEMENT QUERIES
-- =========================================

-- แสดงคำสั่งซื้อล่าสุด
SELECT 
    o.id,
    o.order_number,
    u.firstName,
    u.lastName,
    u.email,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 20;

-- แสดงรายละเอียดคำสั่งซื้อ (พร้อมรายการสินค้า)
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'ORD001';

-- สถิติคำสั่งซื้อตามสถานะ
SELECT 
    status,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue
FROM orders
GROUP BY status
ORDER BY order_count DESC;

-- รายได้รายเดือน
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue
FROM orders 
WHERE status IN ('delivered', 'shipped')
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- =========================================
-- SALES & ANALYTICS QUERIES
-- =========================================

-- สินค้าที่ขายดีที่สุด
SELECT 
    p.name,
    p.category,
    p.price,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total_price) as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;

-- ยอดขายตามหมวดหมู่
SELECT 
    p.category,
    COUNT(DISTINCT oi.order_id) as order_count,
    SUM(oi.quantity) as items_sold,
    SUM(oi.total_price) as category_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY p.category
ORDER BY category_revenue DESC;

-- ลูกค้าที่ซื้อมากที่สุด
SELECT 
    u.firstName,
    u.lastName,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;

-- =========================================
-- CART & WISHLIST QUERIES
-- =========================================

-- แสดงตะกร้าสินค้าของผู้ใช้
SELECT 
    c.quantity,
    p.name,
    p.price,
    p.image,
    (c.quantity * p.price) as subtotal
FROM cart c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = 2 AND p.isActive = TRUE;

-- คำนวณยอดรวมในตะกร้า
SELECT 
    SUM(c.quantity * p.price) as cart_total
FROM cart c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = 2 AND p.isActive = TRUE;

-- แสดงรายการโปรดของผู้ใช้
SELECT 
    p.id,
    p.name,
    p.price,
    p.image,
    p.rating,
    w.created_at as added_to_wishlist
FROM wishlists w
JOIN products p ON w.product_id = p.id
WHERE w.user_id = 2 AND p.isActive = TRUE
ORDER BY w.created_at DESC;

-- =========================================
-- REVIEW & RATING QUERIES
-- =========================================

-- แสดงรีวิวของสินค้า
SELECT 
    r.rating,
    r.comment,
    r.is_verified_purchase,
    r.created_at,
    u.firstName,
    u.lastName
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = 1
ORDER BY r.created_at DESC;

-- คำนวณคะแนนเฉลี่ยของสินค้า
SELECT 
    product_id,
    COUNT(*) as review_count,
    AVG(rating) as average_rating,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
FROM reviews
WHERE product_id = 1
GROUP BY product_id;

-- สินค้าที่มีรีวิวดีที่สุด (4-5 ดาว)
SELECT 
    p.name,
    AVG(r.rating) as avg_rating,
    COUNT(r.id) as review_count
FROM products p
JOIN reviews r ON p.id = r.product_id
WHERE r.rating >= 4
GROUP BY p.id
HAVING COUNT(r.id) >= 2
ORDER BY avg_rating DESC, review_count DESC;

-- =========================================
-- SEARCH & FILTER QUERIES
-- =========================================

-- ค้นหาสินค้าตามชื่อ
SELECT * FROM products 
WHERE name LIKE '%iPhone%' 
AND isActive = TRUE
ORDER BY rating DESC;

-- กรองสินค้าตามราคา
SELECT * FROM products 
WHERE price BETWEEN 1000 AND 10000 
AND isActive = TRUE
ORDER BY price ASC;

-- กรองสินค้าหลายเงื่อนไข
SELECT * FROM products 
WHERE category = 'Electronics' 
AND price <= 50000 
AND rating >= 4.0 
AND stock > 0 
AND isActive = TRUE
ORDER BY rating DESC, price ASC;

-- =========================================
-- INVENTORY MANAGEMENT
-- =========================================

-- รายงานสินค้าคงคลัง
SELECT 
    category,
    COUNT(*) as product_count,
    SUM(stock) as total_stock,
    AVG(price) as avg_price,
    SUM(stock * price) as inventory_value
FROM products 
WHERE isActive = TRUE
GROUP BY category
ORDER BY inventory_value DESC;

-- สินค้าที่ต้องเติมสต็อก
SELECT 
    name,
    category,
    stock,
    price,
    (stock * price) as current_value
FROM products 
WHERE stock < 20 AND isActive = TRUE
ORDER BY stock ASC;

-- =========================================
-- BUSINESS INTELLIGENCE QUERIES
-- =========================================

-- Dashboard Overview
SELECT 
    (SELECT COUNT(*) FROM users WHERE isActive = TRUE) as total_users,
    (SELECT COUNT(*) FROM products WHERE isActive = TRUE) as total_products,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    (SELECT SUM(total_amount) FROM orders WHERE status = 'delivered' AND DATE(created_at) = CURDATE()) as today_revenue;

-- Monthly Performance
SELECT 
    DATE_FORMAT(o.created_at, '%Y-%m') as month,
    COUNT(DISTINCT o.user_id) as unique_customers,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as revenue,
    AVG(o.total_amount) as avg_order_value
FROM orders o
WHERE o.status IN ('delivered', 'shipped')
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY month DESC;
