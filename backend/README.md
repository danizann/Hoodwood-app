# Hoodwood Backend API

Node.js Express API untuk Warehouse Administration System.

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dengan database credentials Anda
# DB_HOST=localhost
# DB_NAME=hoodwood_db
# DB_USER=hoodwood_user
# DB_PASSWORD=your_password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Ikuti panduan di `../docs/DATABASE_SETUP.md` untuk:
- Install PostgreSQL
- Create database dan user
- Get database credentials

### 4. Run Migrations

```bash
npm run migrate
```

### 5. (Optional) Seed Data

```bash
npm run seed
```

### 6. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/
│   │   └── database.ts       # Database connection
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   ├── migrations/           # Database migrations
│   └── seeds/                # Seed data
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── .env
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi.

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@hoodwood.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@hoodwood.com",
    "role": "admin"
  }
}
```

### Protected Routes

Sertakan token di header:
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

## 👥 Roles

- **Admin**: Full access semua fitur
- **Manager**: Akses manajemen suppliers, sellers, products, orders
- **Staff**: Read-only akses dashboard dan tracking

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Suppliers
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/:id` - Get detail supplier
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Sellers
- `GET /api/sellers` - List sellers
- `GET /api/sellers/:id` - Get detail seller
- `POST /api/sellers` - Create seller
- `PUT /api/sellers/:id` - Update seller
- `DELETE /api/sellers/:id` - Delete seller

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get detail product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get detail order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Tracking (Resi)
- `GET /api/tracking/search` - Search resi (query: `resi`)
- `GET /api/tracking/:resiNumber` - Get tracking detail

### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get detail invoice
- `POST /api/invoices` - Create invoice

## 🛠️ Development

### Compile TypeScript
```bash
npm run build
```

### Production Build
```bash
npm run build
npm run start
```

## 📝 Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL running
- Check DB credentials di `.env`
- Verify database dan user sudah dibuat

### Migration Failed
- Pastikan database kosong atau sudah migration sebelumnya
- Delete folder `dist/` dan rebuild: `npm run build`

### Port Already in Use
- Ubah PORT di `.env` (default 5000)

## 📖 Next Steps

1. Frontend setup - buka `../frontend/README.md`
2. Test API dengan Postman/Insomnia
3. Update .env JWT_SECRET untuk production
