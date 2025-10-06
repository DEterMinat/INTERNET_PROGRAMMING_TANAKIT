# 📖 Delete & Search Functionality

โค้ดสำหรับการทำ **Delete (ลบข้อมูล)** และ **Search (ค้นหา)** ในระบบ Inventory Management

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### 1. **Backend (Express.js + MySQL)**
- `inventory.js` - Routes สำหรับ Delete และ Search (ใช้แทน BACKEND/routes/inventory.js)

### 2. **Frontend (React Native)**
- `inventory.tsx` - Component UI สำหรับ Delete และ Search (ใช้แทน app/(tabs)/inventory.tsx)
- `apiService.ts` - API Service สำหรับเรียก Backend (ใช้แทน services/apiService.ts)

---

## 🔍 Search Functionality (การค้นหา)

### Backend API
```javascript
GET /api/inventory?search=keyword
```

**ค้นหาจาก:**
- ชื่อสินค้า (name)
- รหัส SKU (sku)
- บาร์โค้ด (barcode)
- คำอธิบาย (description)

### Frontend Implementation
```typescript
// State
const [searchQuery, setSearchQuery] = useState('');

// Filter
const filteredInventory = inventory.filter(item => {
  const matchesSearch = 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});

// UI
<TextInput
  placeholder="ค้นหาสินค้า (ชื่อ, SKU)..."
  value={searchQuery}
  onChangeText={setSearchQuery}
/>
```

### API Service
```typescript
// Call with search parameter
const response = await apiService.inventory.getList({
  search: 'iPhone',
  limit: 50
});
```

---

## 🗑️ Delete Functionality (การลบข้อมูล)

### Backend API
```javascript
DELETE /api/inventory/:id
```

**Hard Delete** - ลบออกจากฐานข้อมูลถาวร
```sql
DELETE FROM products WHERE id = ?
```

**Soft Delete** (Optional) - ซ่อนข้อมูล
```sql
UPDATE products SET isActive = 0 WHERE id = ?
```

### Frontend Implementation

**1. เปิด Modal ยืนยัน**
```typescript
const handleDeleteProduct = (item: InventoryItem) => {
  setDeletingItem(item);
  setShowDeleteModal(true);
};
```

**2. ยืนยันการลบ**
```typescript
const confirmDelete = async () => {
  const response = await apiService.inventory.delete(parseInt(deletingItem.id));
  
  if (response.success) {
    Alert.alert('สำเร็จ', 'ลบสินค้าเรียบร้อยแล้ว');
    await loadInventory(); // Reload data
  }
};
```

**3. UI Modal**
```tsx
<Modal visible={showDeleteModal}>
  <Text>คุณต้องการลบสินค้า "{deletingItem?.name}" หรือไม่?</Text>
  <TouchableOpacity onPress={cancelDelete}>
    <Text>ยกเลิก</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={confirmDelete}>
    <Text>ลบถาวร</Text>
  </TouchableOpacity>
</Modal>
```

### API Service
```typescript
delete: async (id: number) => {
  const endpoint = `/api/inventory/${id}`;
  return this.request(endpoint, {
    method: 'DELETE',
  });
}
```

---

## 🎯 Features

### Search (ค้นหา)
✅ ค้นหาแบบ Real-time (พิมพ์ไปค้นหาไป)
✅ ค้นหาจากหลายฟิลด์ (name, sku, barcode, description)
✅ กรองตามหมวดหมู่ (Category Filter)
✅ แสดงจำนวนผลลัพธ์
✅ ปุ่มล้างการค้นหา (Clear button)

### Delete (ลบ)
✅ Hard Delete (ลบถาวร)
✅ Soft Delete (ซ่อนข้อมูล) - Optional
✅ Modal ยืนยันการลบ
✅ แสดงคำเตือนก่อนลบ
✅ Reload ข้อมูลหลังลบ
✅ แสดง Loading state

---

## 🔧 การใช้งาน

### 1. Copy ไฟล์

**Backend:**
```bash
# Copy routes (Windows)
Copy-Item "inventory.js" "../../BACKEND/routes/inventory.js"

# หรือ (Linux/Mac)
cp inventory.js ../../BACKEND/routes/inventory.js
```

**Frontend:**
```bash
# Copy component (Windows)
Copy-Item "inventory.tsx" "../../app/(tabs)/inventory.tsx"
Copy-Item "apiService.ts" "../../services/apiService.ts"

# หรือ (Linux/Mac)
cp inventory.tsx ../../app/\(tabs\)/inventory.tsx
cp apiService.ts ../../services/apiService.ts
```

### 2. ตรวจสอบ Database

ตารางต้องมีฟิลด์:
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  sku VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock INT,
  brand VARCHAR(100),
  description TEXT,
  image VARCHAR(255),
  isActive TINYINT DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3. Restart Server

```bash
cd BACKEND
npm start
```

### 4. Test

**Search:**
- พิมพ์ในช่องค้นหา
- ดูผลลัพธ์แบบ real-time

**Delete:**
- คลิกปุ่ม 🗑️
- ยืนยันการลบ
- ตรวจสอบข้อมูลในฐานข้อมูล

---

## 🐛 Debug Tips

### Search ไม่ทำงาน:
1. ตรวจสอบ Backend route มี `search` parameter
2. ดู console.log ใน Browser
3. ตรวจสอบ API response

### Delete ไม่ทำงาน:
1. ดู console.log "Delete button clicked"
2. ตรวจสอบ Modal แสดงหรือไม่
3. ดู Server log "DELETE /api/inventory/:id"
4. ตรวจสอบ SQL query

### Console Logs:
```javascript
// Frontend
console.log('handleAddProduct called with:', newProduct);
console.log('About to call API with data:', {...});
console.log('API response:', response);

// Backend
console.log('POST /api/inventory called with body:', req.body);
console.log('Delete result:', result);
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | ดึงรายการทั้งหมด |
| GET | `/api/inventory?search=keyword` | 🔍 ค้นหาสินค้า |
| GET | `/api/inventory/:id` | ดึงสินค้า 1 รายการ |
| POST | `/api/inventory` | เพิ่มสินค้าใหม่ |
| PUT | `/api/inventory/:id` | แก้ไขสินค้า |
| DELETE | `/api/inventory/:id` | 🗑️ ลบสินค้า (Hard) |
| DELETE | `/api/inventory/:id/soft` | ลบสินค้า (Soft) |

---

## 💡 Examples

### Search Example
```typescript
// ค้นหาสินค้าที่มีคำว่า "iPhone"
const response = await apiService.inventory.getList({
  search: 'iPhone',
  category: 'อิเล็กทรอนิกส์',
  limit: 20
});
```

### Delete Example
```typescript
// ลบสินค้า ID = 17
const response = await apiService.inventory.delete(17);

if (response.success) {
  console.log('✅ ลบสำเร็จ:', response.message);
  // ลบสินค้า "iPhone 15 Pro" จากคลังสำเร็จ (ลบถาวร)
}
```

---

## 📝 Notes

- **Hard Delete**: ลบออกจาก DB จริงๆ (ใช้ `DELETE`)
- **Soft Delete**: เก็บข้อมูลไว้ แต่ซ่อน (ใช้ `UPDATE isActive = 0`)
- **Search**: ค้นหาแบบ case-insensitive
- **Modal**: แสดงคำเตือนก่อนลบเพื่อป้องกันการลบผิด

---

## 📂 โครงสร้าง Folder

```
Delete and Seach/
├── inventory.js              ← Backend Routes (BACKEND/routes/inventory.js)
├── inventory.tsx             ← Frontend Component (app/(tabs)/inventory.tsx)
├── apiService.ts             ← API Service (services/apiService.ts)
├── README.md                 ← คู่มือการใช้งาน
├── image.png                 ← Screenshots การทำงาน
├── image copy.png
├── image copy 2.png
├── image copy 3.png
└── image copy 4.png
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
4. ✅ Screenshot การทำงาน (Search + Delete) - image.png, image copy.png ฯลฯ
5. ✅ README.md (ไฟล์นี้)

---

**สร้างโดย:** AI Assistant  
**วันที่:** 6 ตุลาคม 2025  
**Version:** 1.0
