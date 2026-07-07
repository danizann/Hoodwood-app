import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './app.js';
import { MemoryStorage } from './storage.js';

async function loginAs(email: string, password: string) {
  const storage = new MemoryStorage();
  await storage.init();
  const app = createApp(storage);
  const response = await request(app).post('/api/auth/login').send({ email, password });
  return { app, storage, response };
}

test('login returns token and current user', async () => {
  const { app, response } = await loginAs('admin@hoodwood.com', 'admin123');
  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  const me = await request(app).get('/api/auth/me').set('Authorization', 'Bearer ' + response.body.token);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'admin@hoodwood.com');
  assert.equal(me.body.user.role, 'admin');
});

test('register creates a staff user by default', async () => {
  const storage = new MemoryStorage();
  await storage.init();
  const app = createApp(storage);
  const register = await request(app).post('/api/auth/register').send({
    email: 'newstaff@hoodwood.com',
    password: 'secret123',
    name: 'New Staff'
  });
  assert.equal(register.status, 201);
  assert.equal(register.body.user.role, 'staff');
});

test('tracking search supports query, pagination, and sorting', async () => {
  const { app, response } = await loginAs('admin@hoodwood.com', 'admin123');
  const search = await request(app)
    .get('/api/tracking/search')
    .query({ resi: 'HW1', page: 1, pageSize: 2, sortBy: 'resiNumber', sortOrder: 'asc' })
    .set('Authorization', 'Bearer ' + response.body.token);

  assert.equal(search.status, 200);
  assert.equal(search.body.page, 1);
  assert.equal(search.body.pageSize, 2);
  assert.equal(search.body.total, 6);
  assert.deepEqual(
    search.body.data.map((item: { resiNumber: string }) => item.resiNumber),
    ['HW1001A', 'HW1002B']
  );
});

test('staff cannot access management orders endpoint', async () => {
  const { app, response } = await loginAs('staff@hoodwood.com', 'staff123');
  const orders = await request(app).get('/api/orders').set('Authorization', 'Bearer ' + response.body.token);
  assert.equal(orders.status, 403);
});

test('orders endpoint returns invoice and pricing details', async () => {
  const { app, response } = await loginAs('admin@hoodwood.com', 'admin123');
  const ordersResponse = await request(app).get('/api/orders').set('Authorization', 'Bearer ' + response.body.token);

  assert.equal(ordersResponse.status, 200);
  assert.ok(Array.isArray(ordersResponse.body.data));
  assert.equal(typeof ordersResponse.body.data[0].productName, 'string');
  assert.equal(typeof ordersResponse.body.data[0].invoiceNumber, 'string');
  assert.equal(typeof ordersResponse.body.data[0].unitPrice, 'number');
  assert.equal(typeof ordersResponse.body.data[0].shippingCost, 'number');
  assert.equal(typeof ordersResponse.body.data[0].taxAmount, 'number');
  assert.equal(typeof ordersResponse.body.data[0].totalPrice, 'number');
});
