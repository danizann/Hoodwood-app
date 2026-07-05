# Hoodwood App - Warehouse Administration System

Aplikasi administrasi gudang modern dengan fitur manajemen supplier, penjual, produk, pesanan, invoice, dan tracking resi.

## 🚀 Fitur Utama

- **Dashboard**: Statistik dan overview gudang
- **Autentikasi & Role-Based Access**: Admin, Manager, Staff
- **Manajemen Supplier**: CRUD supplier
- **Manajemen Penjual**: CRUD seller
- **Manajemen Produk**: CRUD produk dengan kategori
- **Manajemen Pesanan**: Order processing dan tracking
- **Manajemen Invoice**: Invoice generation dan management
- **Filter Resi**: Tracking resi dengan format kombinasi huruf dan angka
- **Responsif Mobile**: UI modern dengan Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Axios
- React Query

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcryptjs

## 📁 Project Structure

```
hoodwood-app/
├── frontend/          # React Application
├── backend/           # Node.js API Server
├── docs/              # Documentation
└── README.md
```

## 🏃 Cara Memulai

Lihat instruksi setup di folder `frontend/` dan `backend/`.

### Quick Start

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📝 License

MIT
