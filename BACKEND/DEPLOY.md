# Deployment Instructions

## 📦 Deploy to nindam.sytes.net Server

### 1. Prepare Files for Upload
```bash
# Create deployment package
zip -r backend-deploy.zip . -x "node_modules/*" "*.log" ".git/*" "test-*.js"
```

### 2. Server Setup Commands
```bash
# On server (nindam.sytes.net)
cd /var/www/
mkdir -p tanakit-backend
cd tanakit-backend

# Upload and extract files
# (Upload backend-deploy.zip via FTP/SCP)
unzip backend-deploy.zip
npm install

# Set permissions
chmod +x server.js
chmod 755 .
```

### 3. Database Connection Test on Server
```bash
# Test DB connection from server
node test-db.js
```

### 4. Start Production Server
```bash
# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "tanakit-backend"
pm2 save
pm2 startup

# Or start with node
nohup node server.js > app.log 2>&1 &
```

### 5. Verify Deployment
- API: http://nindam.sytes.net:9785/api/products
- Health: http://nindam.sytes.net:9785/

## 🔧 Environment Variables on Server
Make sure `.env` file has correct production settings:
- NODE_ENV=production
- DB_HOST=localhost (on server, DB is localhost)
- CORS_ORIGIN includes production URLs

## 🗄️ Database Access
Once deployed on server, the MySQL connection should work because:
- Server has direct localhost access to MySQL
- No firewall restrictions for local connections
- Proper user permissions for localhost connections

## 🔥 Quick Deploy Script
```bash
#!/bin/bash
# deploy.sh
npm install
node test-db.js  # Verify DB connection
pm2 restart tanakit-backend || pm2 start server.js --name "tanakit-backend"
echo "Deployment completed!"
```
