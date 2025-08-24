#!/bin/bash

# Quick deployment script for nindam.sytes.net
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test database connection
echo "🔗 Testing database connection..."
if node test-db.js; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed, but continuing with JSON fallback"
fi

# Stop existing process
echo "🛑 Stopping existing server..."
pm2 stop tanakit-backend 2>/dev/null || echo "No existing process found"

# Start new server
echo "🎯 Starting server..."
pm2 start server.js --name "tanakit-backend" --watch --ignore-watch="node_modules data logs"

# Save PM2 configuration
pm2 save

# Show status
echo "📊 Server status:"
pm2 list

echo "✅ Deployment completed!"
echo "🔗 API URL: http://nindam.sytes.net:9785/api/products"
echo "📋 Logs: pm2 logs tanakit-backend"
