# Quick Start Script for Image Upload Feature
# Run this in PowerShell

Write-Host "🚀 Starting Final Exam Inventory System with Image Upload" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".\package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location BACKEND
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Create uploads directory
Write-Host "📁 Creating uploads directory..." -ForegroundColor Yellow
if (-not (Test-Path ".\BACKEND\uploads")) {
    New-Item -ItemType Directory -Path ".\BACKEND\uploads" | Out-Null
    Write-Host "✅ Created BACKEND/uploads directory" -ForegroundColor Green
} else {
    Write-Host "✅ BACKEND/uploads directory already exists" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start Backend Server:" -ForegroundColor White
Write-Host "     cd BACKEND" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. In a new terminal, start Frontend:" -ForegroundColor White
Write-Host "     npx expo start --port 30019" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Test the app:" -ForegroundColor White
Write-Host "     - Open Expo Go on your device" -ForegroundColor Gray
Write-Host "     - Scan the QR code" -ForegroundColor Gray
Write-Host "     - Navigate to 'Final Inventory' tab" -ForegroundColor Gray
Write-Host "     - Test image upload feature!" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For detailed instructions, see IMAGE_UPLOAD_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Ready for Final Exam!" -ForegroundColor Green
