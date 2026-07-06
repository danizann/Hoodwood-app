# QUICKSTART.md - Quick Commands

Perintah-perintah cepat untuk menjalankan Hoodwood App.

## 🚀 Start All (Recommended)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Atau gunakan concurrently:
```bash
npm install -g concurrently
npm run dev
```

## 🗄️ Database Setup (First Time Only)

```bash
# Create database
psql -U postgres
CREATE DATABASE hoodwood_db;
CREATE USER hoodwood_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;
\q

# Or run in one command (Linux/macOS):
psql -U postgres -c "CREATE DATABASE hoodwood_db;" && \
psql -U postgres -c "CREATE USER hoodwood_user WITH PASSWORD 'password123';" && \
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE hoodwood_db TO hoodwood_user;"
```

## 📦 Install & Migrate

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed

# Frontend
cd frontend
npm install
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: See docs/API.md

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

```bash
# Kill port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Check PostgreSQL status
pg_isready

# Reconnect to database
psql -U hoodwood_user -d hoodwood_db
```

## 📚 Full Guides

- [GETTING_STARTED.md](GETTING_STARTED.md) - 15-minute setup
- [SETUP.md](SETUP.md) - Complete setup guide
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Problem solving

---

**Ready to code! Happy hacking! 🚀**
