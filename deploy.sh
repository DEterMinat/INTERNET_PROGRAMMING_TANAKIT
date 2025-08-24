#!/bin/bash

# Production Server Deployment Script
# สำหรับ deploy บน server production

echo "🚀 Starting Production Deployment..."

# ตรวจสอบ current directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# ตรวจสอบว่า BACKEND folder มีอยู่
if [ ! -d "BACKEND" ]; then
    echo "❌ Error: BACKEND directory not found."
    exit 1
fi

# เข้าไปใน BACKEND directory
cd BACKEND

echo "📦 Installing/Updating Backend dependencies..."
npm install --production

# ตรวจสอบ .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in BACKEND directory"
    echo "📝 Please make sure to create .env file with:"
    echo "   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD"
    echo "   - JWT_SECRET, PORT"
    echo ""
else
    echo "✅ .env file found"
fi

# ทดสอบ Database connection
echo "🔍 Testing Database connection..."
if npm run test-db; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "🔧 Please check:"
    echo "   1. MySQL service is running"
    echo "   2. Database credentials in .env are correct"
    echo "   3. Database 'it_std6630202261' exists"
    echo "   4. Tables are created properly"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the backend server:"
echo "   cd BACKEND"
echo "   npm start"
echo ""
echo "2. Or use PM2 for production:"
echo "   pm2 start server.js --name 'internet-programming-backend'"
echo ""
echo "3. Backend will be available at:"
echo "   - Local: http://localhost:9785"
echo "   - Production: http://nindam.sytes.net:9785"
echo ""
echo "4. Test health check:"
echo "   curl http://localhost:9785/health"
echo ""
echo "5. Test products API:"
echo "   curl http://localhost:9785/api/db-products"
echo ""

# กลับไปที่ root directory
cd ..

echo "✨ Ready for production! ✨"
