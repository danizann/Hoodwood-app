# Hoodwood App - Windows PowerShell Setup Script
# Jalankan dengan: .\setup.ps1
# Jika ada error "execution policy", jalankan dulu:
#   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Hoodwood App - Windows Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Gagal install root dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/3] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Gagal install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "[3/3] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Gagal install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Dependencies berhasil di-install!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor White
Write-Host ""
Write-Host "1. Buat database PostgreSQL (jalankan di psql):" -ForegroundColor Yellow
Write-Host '   CREATE DATABASE hoodwood_db;' -ForegroundColor Gray
Write-Host "   CREATE USER hoodwood_user WITH PASSWORD 'password123';" -ForegroundColor Gray
Write-Host '   GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;' -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copy file konfigurasi:" -ForegroundColor Yellow
Write-Host "   Copy-Item backend\.env.example backend\.env" -ForegroundColor Gray
Write-Host "   Lalu edit backend\.env sesuai konfigurasi database Anda." -ForegroundColor Gray
Write-Host ""
Write-Host "3. Jalankan migrasi database:" -ForegroundColor Yellow
Write-Host "   npm run migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Jalankan seed data awal:" -ForegroundColor Yellow
Write-Host "   npm run seed" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Jalankan aplikasi:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Akses aplikasi:" -ForegroundColor White
Write-Host "   Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend  : http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login: admin@hoodwood.com / admin123" -ForegroundColor Cyan
