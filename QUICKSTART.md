# QUICKSTART.md - Quick Commands

Perintah-perintah cepat untuk menjalankan Hoodwood App.

## 🖥️ Windows Setup (Pertama Kali)

**Cara termudah** — klik dua kali atau jalankan salah satu:

```bat
REM CMD / Command Prompt:
setup.bat

REM PowerShell:
.\setup.ps1
```

> Jika PowerShell menolak karena execution policy, jalankan dulu:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 🚀 Start All (Recommended)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Atau gunakan concurrently (satu terminal):
```bash
npm run dev
```

## 🗄️ Database Setup (First Time Only)

```bash
# Connect ke PostgreSQL lalu jalankan:
psql -U postgres
CREATE DATABASE hoodwood_db;
CREATE USER hoodwood_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;
\q
```

**Linux/macOS — satu baris:**
```bash
psql -U postgres -c "CREATE DATABASE hoodwood_db;" && \
psql -U postgres -c "CREATE USER hoodwood_user WITH PASSWORD 'password123';" && \
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;"
```

**Windows CMD — satu baris:**
```bat
psql -U postgres -c "CREATE DATABASE hoodwood_db;" && psql -U postgres -c "CREATE USER hoodwood_user WITH PASSWORD 'password123';" && psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;"
```

## 📦 Install & Migrate

**Linux/macOS:**
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed

cd ../frontend
npm install
```

**Windows CMD:**
```bat
cd backend
copy .env.example .env
npm install
npm run migrate
npm run seed
cd ..
cd frontend
npm install
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Login Credentials

```
Email: admin@hoodwood.com
Password: admin123
```

## 🛑 Stop Servers

```bash
# Ctrl+C in each terminal
```

## 🔄 Reset Database

```bash
cd backend
npm run migrate:reset
npm run seed
```

## 📊 Database Commands

```bash
# Connect to database
psql -U hoodwood_user -d hoodwood_db

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Reset migrations
npm run migrate:reset
```

## 🔨 Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## ✅ Verify Setup

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check PostgreSQL
psql --version

# Test backend
curl http://localhost:5000/api/auth/me

# Test frontend (in browser)
http://localhost:3000
```

## 🆘 Quick Troubleshooting

**Linux/macOS:**
```bash
# Kill port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Check PostgreSQL status
pg_isready
```

**Windows CMD:**
```bat
REM Kill port 5000 (backend) — cari PID dulu lalu kill
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

REM Kill port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

REM Check PostgreSQL status
pg_isready
```

**Windows PowerShell:**
```powershell
# Kill port 5000 (backend)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Kill port 3000 (frontend)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

**Reconnect to database:**
```bash
psql -U hoodwood_user -d hoodwood_db
```

## 📚 Full Guides

- [GETTING_STARTED.md](GETTING_STARTED.md) - 15-minute setup
- [SETUP.md](SETUP.md) - Complete setup guide
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Problem solving

---

**Ready to code! Happy hacking! 🚀**
