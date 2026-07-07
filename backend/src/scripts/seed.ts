import 'dotenv/config';
import { Pool } from 'pg';
import { getConfig } from '../config.js';
import { defaultOrders, defaultTrackingRecords, defaultUsers } from '../defaultData.js';
import { createStorage } from '../storage.js';

const config = getConfig();

if (!config.databaseUrl && !config.dbHost) {
  const storage = createStorage();
  await storage.reset();
  console.log('Seeded local file storage.');
  process.exit(0);
}

const pool = new Pool(
  config.databaseUrl
    ? { connectionString: config.databaseUrl }
    : {
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        user: config.dbUser,
        password: config.dbPassword
      }
);

for (const user of defaultUsers) {
  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, role, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, role = EXCLUDED.role`,
    [user.id, user.email, user.passwordHash, user.name, user.role, user.createdAt]
  );
}

for (const tracking of defaultTrackingRecords) {
  await pool.query(
    `INSERT INTO tracking_records (resi_number, status, sender, recipient, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (resi_number) DO UPDATE SET status = EXCLUDED.status, sender = EXCLUDED.sender, recipient = EXCLUDED.recipient, updated_at = EXCLUDED.updated_at`,
    [tracking.resiNumber, tracking.status, tracking.sender, tracking.recipient, tracking.createdAt, tracking.updatedAt]
  );
}

for (const order of defaultOrders) {
  await pool.query(
    `INSERT INTO orders (id, order_number, customer_name, product_name, invoice_number, unit_price, quantity, shipping_cost, tax_amount, total_price, resi_number, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (order_number) DO UPDATE SET
       customer_name = EXCLUDED.customer_name,
       product_name = EXCLUDED.product_name,
       invoice_number = EXCLUDED.invoice_number,
       unit_price = EXCLUDED.unit_price,
       quantity = EXCLUDED.quantity,
       shipping_cost = EXCLUDED.shipping_cost,
       tax_amount = EXCLUDED.tax_amount,
       total_price = EXCLUDED.total_price,
       resi_number = EXCLUDED.resi_number`,
    [
      order.id,
      order.orderNumber,
      order.customerName,
      order.productName,
      order.invoiceNumber,
      order.unitPrice,
      order.quantity,
      order.shippingCost,
      order.taxAmount,
      order.totalPrice,
      order.resiNumber,
      order.createdAt
    ]
  );
}

await pool.end();
console.log('Seed completed.');
