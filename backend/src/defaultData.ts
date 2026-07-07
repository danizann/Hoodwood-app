import { randomUUID } from 'node:crypto';
import type { Order, TrackingRecord, User } from './types.js';

const now = new Date();

const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

export const defaultUsers: User[] = [
  {
    id: randomUUID(),
    email: 'admin@hoodwood.com',
    passwordHash: '$2b$10$W4NX0HyAdE9OEfqPLkEVQuAG0b4Ijw5SZVCa4C/bxaLhyhEsQGeUS',
    name: 'Warehouse Admin',
    role: 'admin',
    createdAt: iso(10)
  },
  {
    id: randomUUID(),
    email: 'manager@hoodwood.com',
    passwordHash: '$2b$10$xy7Xrns0xjjxxEdHG/bYQOuwtROKBwMWqVRWd7/eBPPmbGNqcrW6e',
    name: 'Warehouse Manager',
    role: 'manager',
    createdAt: iso(8)
  },
  {
    id: randomUUID(),
    email: 'staff@hoodwood.com',
    passwordHash: '$2b$10$EFAe40xG7SYfHrlASYOEMe7g.gh04nwA5D92/7VAnFyTQDeKucigu',
    name: 'Warehouse Staff',
    role: 'staff',
    createdAt: iso(6)
  }
];

export const defaultTrackingRecords: TrackingRecord[] = [
  { resiNumber: 'HW1001A', status: 'Pending', sender: 'PT Nusantara', recipient: 'CV Maju Jaya', createdAt: iso(7), updatedAt: iso(7) },
  { resiNumber: 'HW1002B', status: 'In Transit', sender: 'Mega Supplier', recipient: 'Toko Sukses', createdAt: iso(6), updatedAt: iso(5) },
  { resiNumber: 'HW1003C', status: 'Delivered', sender: 'Gudang Pusat', recipient: 'Outlet Bandung', createdAt: iso(5), updatedAt: iso(3) },
  { resiNumber: 'HW1004D', status: 'Pending', sender: 'Sentra Plastik', recipient: 'Outlet Surabaya', createdAt: iso(4), updatedAt: iso(4) },
  { resiNumber: 'HW1005E', status: 'In Transit', sender: 'Global Parts', recipient: 'Outlet Semarang', createdAt: iso(3), updatedAt: iso(2) },
  { resiNumber: 'HW1006F', status: 'Delivered', sender: 'PT Nusantara', recipient: 'Outlet Medan', createdAt: iso(2), updatedAt: iso(1) },
  { resiNumber: 'HW2001X', status: 'Pending', sender: 'Supplier Timur', recipient: 'Outlet Bali', createdAt: iso(1), updatedAt: iso(1) },
  { resiNumber: 'AB3009Z', status: 'Delivered', sender: 'Warehouse QA', recipient: 'Outlet Makassar', createdAt: iso(9), updatedAt: iso(8) }
];

export const defaultOrders: Order[] = [
  {
    id: randomUUID(),
    orderNumber: 'ORD-001',
    customerName: 'CV Maju Jaya',
    productName: 'Premium Storage Rack',
    invoiceNumber: 'INV-2026-001',
    unitPrice: 1500000,
    quantity: 2,
    shippingCost: 120000,
    taxAmount: 312000,
    totalPrice: 3432000,
    resiNumber: 'HW1001A',
    createdAt: iso(7)
  },
  {
    id: randomUUID(),
    orderNumber: 'ORD-002',
    customerName: 'Toko Sukses',
    productName: 'Warehouse Hand Pallet',
    invoiceNumber: 'INV-2026-002',
    unitPrice: 2200000,
    quantity: 1,
    shippingCost: 90000,
    taxAmount: 229000,
    totalPrice: 2519000,
    resiNumber: 'HW1002B',
    createdAt: iso(6)
  },
  {
    id: randomUUID(),
    orderNumber: 'ORD-003',
    customerName: 'Outlet Bandung',
    productName: 'Barcode Scanner Pro',
    invoiceNumber: 'INV-2026-003',
    unitPrice: 850000,
    quantity: 3,
    shippingCost: 75000,
    taxAmount: 280500,
    totalPrice: 2905500,
    resiNumber: 'HW1003C',
    createdAt: iso(5)
  }
];
