# 📖 Edit (Update) Functionality

โค้ดสำหรับการทำ **Edit/Update (แก้ไขข้อมูล)** ในระบบ Inventory Management

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### 1. **Backend (Express.js + MySQL)**
- `inventory.js` - Routes สำหรับ Update (ใช้แทน BACKEND/routes/inventory.js)

### 2. **Frontend (React Native)**
- `inventory.tsx` - Component UI พร้อม Edit Modal (ใช้แทน app/(tabs)/inventory.tsx)
- `apiService.ts` - API Service สำหรับเรียก Backend (ใช้แทน services/apiService.ts)

---

## ✏️ Edit Functionality (การแก้ไขข้อมูล)

### Backend API
```javascript
PUT /api/inventory/:id
```

**อัพเดทข้อมูล:**
- Dynamic Update (อัพเดทเฉพาะฟิลด์ที่ส่งมา)
- Validation (ตรวจสอบว่ามีสินค้าอยู่จริง)
- Auto update `updated_at` timestamp

### SQL Query
```sql
UPDATE products 
SET name = ?, 
    category = ?, 
    price = ?, 
    stock = ?, 
    brand = ?, 
    description = ?, 
    image = ?,
    updated_at = NOW()
WHERE id = ?
```

### Frontend Implementation

**1. เปิด Edit Modal พร้อมข้อมูลเดิม**
```typescript
const handleEditProduct = (item: InventoryItem) => {
  setEditingItem(item);
  setNewProduct({
    name: item.name,
    category: item.category,
    price: item.price.toString(),
    stock: item.stock.toString(),
    brand: item.brand || '',
    description: item.description || '',
    image: item.image || ''
  });
  setShowEditModal(true);
};
```

**2. บันทึกการแก้ไข**
```typescript
const handleUpdateProduct = async () => {
  const response = await apiService.inventory.update(
    parseInt(editingItem.id), 
    {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      brand: newProduct.brand,
      description: newProduct.description,
      image: newProduct.image
    }
  );
  
  if (response.success) {
    Alert.alert('สำเร็จ', 'อัพเดทสินค้าแล้ว');
    await loadInventory(); // Reload data
  }
};
```

**3. UI Edit Modal**
```tsx
<Modal visible={showEditModal}>
  <Text>แก้ไขสินค้า</Text>
  <TextInput value={newProduct.name} onChangeText={...} />
  <TextInput value={newProduct.category} onChangeText={...} />
  <TextInput value={newProduct.price} onChangeText={...} />
  <TextInput value={newProduct.stock} onChangeText={...} />
  
  <TouchableOpacity onPress={cancelEdit}>
    <Text>ยกเลิก</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={handleUpdateProduct}>
    <Text>บันทึก</Text>
  </TouchableOpacity>
</Modal>
```

### API Service
```typescript
update: async (id: number, data: {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  brand?: string;
  description?: string;
  image?: string;
}) => {
  const endpoint = `/api/inventory/${id}`;
  return this.request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
```

---

## 🎯 Features

### ✏️ Edit (แก้ไข)
✅ Edit Modal พร้อมข้อมูลเดิม (Pre-fill data)
✅ Validation ก่อนบันทึก
✅ Dynamic Update (อัพเดทเฉพาะที่เปลี่ยน)
✅ แสดง Loading state ขณะบันทึก
✅ Reload ข้อมูลหลังแก้ไข
✅ แจ้งเตือนเมื่อสำเร็จ/ผิดพลาด
✅ ยกเลิกการแก้ไขได้
✅ แสดง ID และ SKU ของสินค้า

### ฟิลด์ที่แก้ไขได้:
- ชื่อสินค้า (name) *
- หมวดหมู่ (category) *
- ราคา (price) *
- จำนวนสต็อก (stock) *
- แบรนด์/ยี่ห้อ (brand)
- คำอธิบาย (description)
- URL รูปภาพ (image)

---

## 🔧 การใช้งาน

### 1. Copy ไฟล์

**Windows PowerShell:**
```powershell
# Copy Backend
Copy-Item "inventory.js" "..\..\BACKEND\routes\inventory.js"

# Copy Frontend
Copy-Item "inventory.tsx" "..\..\app\(tabs)\inventory.tsx"
Copy-Item "apiService.ts" "..\..\services\apiService.ts"
```

**Linux/Mac:**
```bash
# Copy Backend
cp inventory.js ../../BACKEND/routes/inventory.js

# Copy Frontend
cp inventory.tsx ../../app/\(tabs\)/inventory.tsx
cp apiService.ts ../../services/apiService.ts
```

### 2. ตรวจสอบ Database

ตารางต้องมีฟิลด์:
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock INT,
  brand VARCHAR(100),
  description TEXT,
  image VARCHAR(255),
  isActive TINYINT DEFAULT 1,
  featured TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Restart Server

```bash
cd BACKEND
npm start
```

### 4. Test

**Edit:**
1. คลิกปุ่ม ✏️ แก้ไข
2. Modal จะเปิดพร้อมข้อมูลเดิม
3. แก้ไขข้อมูลที่ต้องการ
4. กดบันทึก
5. ตรวจสอบข้อมูลในฐานข้อมูล

---

## 🐛 Debug Tips

### Edit Modal ไม่เปิด:
1. ดู console.log "✏️ Edit button clicked"
2. ตรวจสอบ state `showEditModal`
3. ตรวจสอบ `editingItem`

### ข้อมูลไม่อัพเดท:
1. ดู console.log "✏️ Update product called"
2. ตรวจสอบ API request payload
3. ดู Server log "PUT /api/inventory/:id"
4. ตรวจสอบ SQL query และ values

### Modal แสดงข้อมูลผิด:
1. ตรวจสอบ `handleEditProduct` function
2. ดู `newProduct` state
3. ตรวจสอบการ map ข้อมูล

### Console Logs:
```javascript
// Frontend
console.log('✏️ Edit button clicked for:', item);
console.log('Editing item:', editingItem);
console.log('New data:', newProduct);
console.log('Sending update request:', updateData);
console.log('✅ Update response:', response);

// Backend
console.log('✏️ PUT /api/inventory/:id called');
console.log('ID:', id);
console.log('Request body:', req.body);
console.log('✅ Item found:', existingItem[0].name);
console.log('📝 Update query:', updateQuery);
console.log('✅ Updated item:', updatedItem);
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | ดึงรายการทั้งหมด |
| GET | `/api/inventory/:id` | ดึงสินค้า 1 รายการ |
| POST | `/api/inventory` | เพิ่มสินค้าใหม่ |
| **PUT** | **`/api/inventory/:id`** | **✏️ แก้ไขสินค้า** |
| PUT | `/api/inventory/:id/stock` | อัพเดทสต็อกเท่านั้น |
| DELETE | `/api/inventory/:id` | ลบสินค้า |

---

## 💡 Examples

### Edit Example
```typescript
// แก้ไขสินค้า ID = 17
const response = await apiService.inventory.update(17, {
  name: 'iPhone 15 Pro Max',
  category: 'อิเล็กทรอนิกส์',
  price: 45900,
  stock: 15,
  brand: 'Apple'
});

if (response.success) {
  console.log('✅ อัพเดทสำเร็จ:', response.message);
  // อัพเดทสินค้า "iPhone 15 Pro" สำเร็จ
}
```

### Get Single Item for Editing
```typescript
// ดึงข้อมูลสินค้า 1 รายการ
const response = await apiService.inventory.getById(17);

if (response.success) {
  const item = response.data;
  // Pre-fill form with existing data
  setNewProduct({
    name: item.name,
    category: item.category,
    price: item.price.toString(),
    stock: item.stock.toString(),
    brand: item.brand || '',
    description: item.description || '',
    image: item.image || ''
  });
}
```

### Partial Update
```typescript
// อัพเดทเฉพาะราคาและสต็อก
const response = await apiService.inventory.update(17, {
  price: 44900,
  stock: 20
});
```

---

## 📝 Notes

- **Dynamic Update**: อัพเดทเฉพาะฟิลด์ที่ส่งมา (ไม่ต้องส่งทุกฟิลด์)
- **Pre-fill Data**: Modal จะแสดงข้อมูลเดิมให้แก้ไข
- **Validation**: ตรวจสอบฟิลด์ที่จำเป็นก่อนบันทึก
- **Auto Timestamp**: `updated_at` จะถูกอัพเดทอัตโนมัติ
- **Reload**: ข้อมูลจะถูก reload หลังแก้ไขสำเร็จ

---

## 📂 โครงสร้าง Folder

```
Edit/
├── inventory.js              ← Backend Routes (BACKEND/routes/inventory.js)
├── inventory.tsx             ← Frontend Component (app/(tabs)/inventory.tsx)
├── apiService.ts             ← API Service (services/apiService.ts)
├── README.md                 ← คู่มือการใช้งาน
├── image.png                 ← Screenshots การทำงาน
├── image copy.png
└── image copy 2.png
```

## 📍 Path ที่ใช้ใน Project จริง

| ไฟล์ในโฟลเดอร์ | Path ใน Project จริง |
|----------------|---------------------|
| `inventory.js` | `BACKEND/routes/inventory.js` |
| `inventory.tsx` | `app/(tabs)/inventory.tsx` |
| `apiService.ts` | `services/apiService.ts` |

---

## 🎓 สำหรับการส่งงาน

ไฟล์ที่ต้องส่ง:
1. ✅ `inventory.js` - Backend routes (BACKEND/routes/inventory.js)
2. ✅ `inventory.tsx` - Frontend component (app/(tabs)/inventory.tsx)
3. ✅ `apiService.ts` - API service (services/apiService.ts)
4. ✅ Screenshot การทำงาน (Edit) - image.png, image copy.png ฯลฯ
5. ✅ README.md (ไฟล์นี้)

---

## 🔄 Flow การทำงาน

```
1. User คลิกปุ่ม ✏️ แก้ไข
   ↓
2. เปิด Edit Modal พร้อมข้อมูลเดิม
   ↓
3. User แก้ไขข้อมูล
   ↓
4. User กดบันทึก
   ↓
5. Validation ข้อมูล
   ↓
6. ส่ง PUT request ไป Backend
   ↓
7. Backend ตรวจสอบและอัพเดท Database
   ↓
8. ส่ง response กลับมา
   ↓
9. แสดงข้อความสำเร็จ/ผิดพลาด
   ↓
10. Reload ข้อมูลใหม่
```

---

## 🎨 UI Components

### Edit Button
- Icon: ✏️
- Color: Blue (#3B82F6)
- Position: ในแต่ละแถวของตาราง

### Edit Modal
- **Header**: แสดง "✏️ แก้ไขสินค้า", ID และ SKU
- **Form Fields**:
  - ชื่อสินค้า (required)
  - หมวดหมู่ (required, dropdown style)
  - ราคา (required, numeric)
  - จำนวนสต็อก (required, numeric)
  - แบรนด์/ยี่ห้อ (optional)
  - คำอธิบาย (optional, multiline)
  - URL รูปภาพ (optional)
- **Buttons**:
  - ยกเลิก (Gray)
  - 💾 บันทึก (Blue)

---

**สร้างโดย:** AI Assistant  
**วันที่:** 6 ตุลาคม 2025  
**Version:** 1.0  
**สำหรับ:** Inventory Management System
