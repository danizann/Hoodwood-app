@echo off
chcp 65001 >nul
echo ================================================
echo    Hoodwood App - Windows Setup Script
echo ================================================
echo.

echo [1/3] Installing root dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Gagal install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Gagal install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Gagal install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ================================================
echo    Dependencies berhasil di-install!
echo ================================================
echo.
echo Langkah selanjutnya:
echo.
echo 1. Buat database PostgreSQL (jalankan di psql):
echo    CREATE DATABASE hoodwood_db;
echo    CREATE USER hoodwood_user WITH PASSWORD 'password123';
echo    GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;
echo.
echo 2. Copy file konfigurasi:
echo    copy backend\.env.example backend\.env
echo    Lalu edit backend\.env sesuai konfigurasi database Anda.
echo.
echo 3. Jalankan migrasi database:
echo    npm run migrate
echo.
echo 4. Jalankan seed data awal:
echo    npm run seed
echo.
echo 5. Jalankan aplikasi (buka 2 terminal):
echo    Terminal 1: npm run dev-backend
echo    Terminal 2: npm run dev-frontend
echo.
echo    Atau jalankan bersamaan:
echo    npm run dev
echo.
echo Akses aplikasi:
echo    Frontend : http://localhost:3000
echo    Backend  : http://localhost:5000
echo.
echo Login: admin@hoodwood.com / admin123
echo.
pause
