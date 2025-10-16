# Image Upload Feature - Complete Guide

## 📸 Overview
Full image upload functionality for the Final Exam Inventory system. Users can:
- **Pick images** from device gallery
- **Take photos** with camera
- **Upload to server** automatically
- **Preview** before adding product
- **Store URLs** in database

---

## 🚀 Installation Steps

### 1. Install Frontend Dependencies
```powershell
# In project root
npm install
```

The following package has been added to `package.json`:
- `expo-image-picker@~16.3.2`

### 2. Install Backend Dependencies
```powershell
# In BACKEND folder
cd BACKEND
npm install
```

The following package has been added to `BACKEND/package.json`:
- `multer@^1.4.5-lts.1` (for handling multipart/form-data file uploads)

---

## 📁 New Files Created

### Backend Files:
1. **`BACKEND/routes/upload.js`**
   - POST `/api/upload` - Upload image (multipart/form-data)
   - DELETE `/api/upload/:filename` - Delete uploaded image
   - Multer configuration (5MB limit, images only)
   - Auto-creates `BACKEND/uploads/` directory

2. **`BACKEND/uploads/`** (created automatically)
   - Stores uploaded image files
   - Served statically at `/uploads/*`

### Frontend Files:
1. **`app/(tabs)/final-inventory.tsx`** (updated)
   - Image picker UI with camera and gallery options
   - Upload progress indicator
   - Image preview before submit
   - Remove image button

2. **`services/apiService.ts`** (updated)
   - `upload.uploadImage(fileUri)` - Upload file to server
   - `upload.deleteImage(filename)` - Delete file from server

---

## 🛠️ Configuration Changes

### Backend (`BACKEND/server.js`)
```javascript
// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

// Register upload route
app.use('/api/upload', require('./routes/upload'));
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "expo-image-picker": "~16.3.2"
  }
}
```

---

## 🧪 Testing Instructions

### Step 1: Start Backend Server
```powershell
cd BACKEND
npm install  # if not done already
npm run dev
```

Server should start on port `9785` (or your configured port).

### Step 2: Start Frontend
```powershell
# In project root
npm install  # if not done already
npx expo start --port 30019
```

### Step 3: Test Image Upload

#### Option A: Using Expo Go (Mobile Device)
1. Scan QR code with Expo Go app
2. Navigate to "Final Inventory" tab
3. Tap **"📁 Pick Image"** to select from gallery
4. OR tap **"📷 Take Photo"** to use camera
5. Wait for upload (shows "Uploading..." indicator)
6. Image preview appears when upload completes
7. Fill in product details (Name, Qty, Price)
8. Tap **"Add Product"**
9. Product should appear in list with image thumbnail

#### Option B: Test API Directly (cURL)
```powershell
# Test upload endpoint
curl -X POST http://localhost:9785/api/upload `
  -F "image=@path/to/your/image.jpg"
```

Expected response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "image-1697123456789-123456789.jpg",
    "url": "http://localhost:9785/uploads/image-1697123456789-123456789.jpg",
    "path": "/uploads/image-1697123456789-123456789.jpg"
  }
}
```

#### Option C: Test in Web Browser (if expo web supported)
```powershell
npx expo start --web
```

**Note**: Camera may not work in web browser, but gallery picker should work.

---

## 📡 API Endpoints

### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data
Body: { image: [file] }

Response:
{
  "success": true,
  "data": {
    "filename": "water-1697123456789-123456789.jpg",
    "url": "http://server:9785/uploads/water-1697123456789-123456789.jpg",
    "path": "/uploads/water-1697123456789-123456789.jpg"
  }
}
```

### Delete Image
```
DELETE /api/upload/:filename

Response:
{
  "success": true,
  "message": "File deleted successfully",
  "filename": "water-1697123456789-123456789.jpg"
}
```

### View Uploaded Image
```
GET /uploads/:filename
(Static file serving - returns image directly)
```

---

## 🔒 Security Features

### File Validation
- **Allowed types**: JPEG, JPG, PNG, GIF, WEBP
- **Max file size**: 5MB
- **MIME type checking**: Server validates file type
- **Extension checking**: Double validation on extension

### Storage Security
- **Unique filenames**: Timestamp + random number prevents collisions
- **Directory isolation**: Files stored in dedicated `uploads/` folder
- **Static serving**: Read-only access via HTTP

---

## 🎨 UI Features

### Image Picker
- Two options: Gallery picker or Camera
- Permission requests handled automatically
- Image aspect ratio: 4:3
- Quality: 0.8 (compressed for faster upload)

### Upload Progress
- Loading indicator during upload
- Disabled buttons while uploading
- Success/error alerts
- Preview thumbnail after upload

### Image Preview
- 200x200px preview
- Remove button (✕) to clear selection
- Shows before product submission

---

## 📝 Usage in Code

### Frontend (React Native)
```typescript
import { apiService } from '@/services/apiService';
import * as ImagePicker from 'expo-image-picker';

// Pick and upload image
const pickAndUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const response = await apiService.upload.uploadImage(result.assets[0].uri);
    if (response.success) {
      const imageUrl = response.data.url;
      // Use imageUrl in your product data
    }
  }
};
```

### Backend (Express.js)
```javascript
// Upload route is already configured
// Access uploaded file data via req.file
router.post('/upload', upload.single('image'), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url: fileUrl } });
});
```

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'expo-image-picker'"
**Solution**:
```powershell
npm install
# OR
npx expo install expo-image-picker
```

### Problem: "Permission Denied" when accessing camera/gallery
**Solution**: 
- On iOS: Check Settings > [Your App] > Enable Photos/Camera
- On Android: Grant permissions when prompted
- In code: `ImagePicker.requestMediaLibraryPermissionsAsync()` is already called

### Problem: Upload fails with network error
**Solution**:
1. Check backend server is running
2. Verify API_BASE_URL in `config/environment.ts`
3. For physical device: Use your computer's IP instead of localhost
   ```typescript
   // In config/environment.ts
   baseUrls: {
     development: 'http://192.168.x.x:9785',  // Your computer's IP
   }
   ```

### Problem: Images don't display after upload
**Solution**:
1. Verify `app.use('/uploads', express.static('uploads'))` in server.js
2. Check BACKEND/uploads/ folder contains files
3. Test direct URL: `http://localhost:9785/uploads/[filename]`

### Problem: "File too large" error
**Solution**:
- Current limit: 5MB
- To increase, edit `BACKEND/routes/upload.js`:
  ```javascript
  const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  });
  ```

---

## 🌐 Production Deployment

### Update URLs for Production
In `config/environment.ts`:
```typescript
baseUrls: {
  production: 'http://nindam.sytes.net:9785'
}
```

### Ensure Uploads Directory Permissions
```bash
# On production server
mkdir -p BACKEND/uploads
chmod 755 BACKEND/uploads
```

### Static File Serving
Backend automatically serves files from `/uploads/` route.
Uploaded images accessible at:
```
http://nindam.sytes.net:9785/uploads/[filename].jpg
```

---

## 📋 Checklist for Exam

- [ ] Backend server running (port 9785)
- [ ] Frontend app running (Expo)
- [ ] Permissions granted (Camera & Photos)
- [ ] Can pick image from gallery
- [ ] Can take photo with camera
- [ ] Upload shows progress indicator
- [ ] Image preview appears after upload
- [ ] Product creates successfully with image
- [ ] Image displays in product list
- [ ] Image URLs stored in database column `6630202261_Img_Path`

---

## 🎓 Final Exam Notes

### Database Integration
- Uploaded image URL is automatically stored in `6630202261_Img_Path` column
- Example URL: `http://localhost:9785/uploads/water-1697123456789.jpg`
- Images persist across app restarts

### Demo Flow
1. Open "Final Inventory" screen
2. Tap "📁 Pick Image" or "📷 Take Photo"
3. Select/capture product image (e.g., Water bottle)
4. Wait for "Image uploaded successfully" alert
5. Enter: Name="Water", Qty=50, Price=10.00
6. Tap "Add Product"
7. Product appears with thumbnail image

---

**Created by**: TANAKIT (std6630202261)  
**Date**: October 16, 2025  
**Feature**: Image Upload for Final Exam Inventory System  
**Status**: ✅ Ready for Testing
