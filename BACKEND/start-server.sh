#!/bin/bash

# Production Server Start Script
# สำหรับเริ่ม Backend Server บน IP: 119.59.102.61:9785

echo "🚀 Starting Backend Server on 119.59.102.61:9785..."

# ตรวจสอบ current directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Please run from BACKEND directory."
    exit 1
fi

# ตรวจสอบ .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Creating basic .env file..."
    cat > .env << EOF
# Environment Configuration
NODE_ENV=production
PORT=9785

# API Configuration
API_VERSION=v1
API_BASE_URL=http://119.59.102.61:9785

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=it_std6630202261
DB_USER=std6630202261
DB_PASSWORD=M3@zWq7L

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://119.59.102.61:30019
EOF
    echo "✅ .env file created with default values"
else
    echo "✅ .env file found"
fi

# ทดสอบ Database connection
echo "🔍 Testing Database connection..."
if npm run test-db; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "⚠️  Server will start anyway, but database features may not work"
fi

echo ""
echo "🎯 Starting Backend Server..."
echo "📡 Server will be available at: http://119.59.102.61:9785"
echo "🔗 API Endpoints:"
echo "   - Health Check: http://119.59.102.61:9785/health"
echo "   - Products: http://119.59.102.61:9785/api/db-products"
echo "   - Inventory: http://119.59.102.61:9785/api/inventory"
echo "   - Dashboard: http://119.59.102.61:9785/api/dashboard"
echo ""

# เริ่ม server
npm start
