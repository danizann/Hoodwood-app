export const ROLES = ['admin', 'manager', 'staff'] as const;
export const TRACKING_STATUSES = ['Pending', 'In Transit', 'Delivered'] as const;
export const TRACKING_SORT_FIELDS = ['resiNumber', 'status', 'createdAt', 'updatedAt'] as const;

export type Role = (typeof ROLES)[number];
export type TrackingStatus = (typeof TRACKING_STATUSES)[number];
export type TrackingSortField = (typeof TRACKING_SORT_FIELDS)[number];
export type SortOrder = 'asc' | 'desc';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface TrackingRecord {
  resiNumber: string;
  status: TrackingStatus;
  sender: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  invoiceNumber: string;
  unitPrice: number;
  quantity: number;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  resiNumber: string | null;
  createdAt: string;
}

export interface TrackingSearchParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy: TrackingSortField;
  sortOrder: SortOrder;
}

export interface TrackingSearchResult {
  data: TrackingRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
