# วิธีแก้ปัญหา Expo CLI not found

## วิธีที่ 1: ใช้ npx (แนะนำ)
```bash
npx expo start --web
```

## วิธีที่ 2: ตรวจสอบ PATH
```bash
# ตรวจสอบว่า expo อยู่ที่ไหน
which expo
npm bin -g

# เพิ่ม PATH (ถ้าจำเป็น)
export PATH=$PATH:$(npm bin -g)
```

## วิธีที่ 3: ใช้ Expo Development Build
```bash
# แทนที่จะใช้ expo start --web ให้ใช้
npx @expo/cli start --web
```

## วิธีที่ 4: อัปเดต package.json scripts
แก้ไขไฟล์ `package.json`:
```json
{
  "scripts": {
    "web": "npx expo start --web",
    "start": "npx expo start",
    "android": "npx expo start --android",
    "ios": "npx expo start --ios"
  }
}
```

## วิธีที่ 5: ติดตั้งใหม่
```bash
# ลบ expo เก่า
npm uninstall -g @expo/cli expo-cli

# ติดตั้งใหม่
npm install -g @expo/cli@latest

# หรือใช้ yarn
yarn global add @expo/cli@latest
```

## วิธีที่ 6: ใช้ local installation
```bash
# ติดตั้งใน project
npm install @expo/cli --save-dev

# แล้วใช้ในไฟล์ package.json
"web": "expo start --web"
```

ลองใช้ `npx expo start --web` ก่อน เพราะจะไม่มีปัญหาเรื่อง global installation
