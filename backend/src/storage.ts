import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { defaultOrders, defaultTrackingRecords, defaultUsers } from './defaultData.js';
import { getConfig } from './config.js';
import type { Order, Role, SortOrder, TrackingRecord, TrackingSearchParams, TrackingSearchResult, User } from './types.js';

interface AppData {
  users: User[];
  trackingRecords: TrackingRecord[];
  orders: Order[];
}

export interface AppStorage {
  init(): Promise<void>;
  reset(): Promise<void>;
  createUser(input: { email: string; passwordHash: string; name: string; role: Role }): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  searchTracking(params: TrackingSearchParams): Promise<TrackingSearchResult>;
  getTrackingByResi(resiNumber: string): Promise<TrackingRecord | null>;
  listOrders(): Promise<Order[]>;
}

function cloneData(): AppData {
  return {
    users: structuredClone(defaultUsers),
    trackingRecords: structuredClone(defaultTrackingRecords),
    orders: structuredClone(defaultOrders)
  };
}

function compareValues(left: string, right: string, sortOrder: SortOrder): number {
  const direction = sortOrder === 'asc' ? 1 : -1;
  return left.localeCompare(right) * direction;
}

function paginateTracking(items: TrackingRecord[], params: TrackingSearchParams): TrackingSearchResult {
  const filtered = params.query
    ? items.filter((item) => item.resiNumber.toLowerCase().includes(params.query.toLowerCase()))
    : items;
  const sorted = [...filtered].sort((left, right) => {
    const value = compareValues(String(left[params.sortBy]), String(right[params.sortBy]), params.sortOrder);
    return value === 0 ? compareValues(left.resiNumber, right.resiNumber, 'asc') : value;
  });
  const total = sorted.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  return {
    data: sorted.slice(start, start + params.pageSize),
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages
  };
}

export class MemoryStorage implements AppStorage {
  protected data: AppData = cloneData();

  async init(): Promise<void> {
    await this.reset();
  }

  async reset(): Promise<void> {
    this.data = cloneData();
  }

  async createUser(input: { email: string; passwordHash: string; name: string; role: Role }): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
      role: input.role,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.data.users.find((user) => user.id === id) ?? null;
  }

  async searchTracking(params: TrackingSearchParams): Promise<TrackingSearchResult> {
    return paginateTracking(this.data.trackingRecords, params);
  }

  async getTrackingByResi(resiNumber: string): Promise<TrackingRecord | null> {
    return this.data.trackingRecords.find((item) => item.resiNumber === resiNumber) ?? null;
  }

  async listOrders(): Promise<Order[]> {
    return [...this.data.orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}

export class FileStorage extends MemoryStorage {
  constructor(private readonly filePath: string) {
    super();
  }

  override async init(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      const raw = await readFile(this.filePath, 'utf8');
      this.data = JSON.parse(raw) as AppData;
    } catch {
      await this.reset();
    }
  }

  override async reset(): Promise<void> {
    this.data = cloneData();
    await this.persist();
  }

  override async createUser(input: { email: string; passwordHash: string; name: string; role: Role }): Promise<User> {
    const user = await super.createUser(input);
    await this.persist();
    return user;
  }

  private async persist(): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }
}

function mapUserRow(row: Record<string, string>): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role as Role,
    createdAt: new Date(row.created_at).toISOString()
  };
}

function mapTrackingRow(row: Record<string, string>): TrackingRecord {
  return {
    resiNumber: row.resi_number,
    status: row.status as TrackingRecord['status'],
    sender: row.sender,
    recipient: row.recipient,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function mapOrderRow(row: Record<string, string>): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    resiNumber: row.resi_number,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export class PostgresStorage implements AppStorage {
  constructor(private readonly pool: Pool) {}

  async init(): Promise<void> {}

  async reset(): Promise<void> {
    await this.pool.query('TRUNCATE orders, tracking_records, users RESTART IDENTITY');
    for (const user of defaultUsers) {
      await this.pool.query(
        'INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.id, user.email, user.passwordHash, user.name, user.role, user.createdAt]
      );
    }
    for (const tracking of defaultTrackingRecords) {
      await this.pool.query(
        'INSERT INTO tracking_records (resi_number, status, sender, recipient, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [tracking.resiNumber, tracking.status, tracking.sender, tracking.recipient, tracking.createdAt, tracking.updatedAt]
      );
    }
    for (const order of defaultOrders) {
      await this.pool.query(
        'INSERT INTO orders (id, order_number, customer_name, resi_number, created_at) VALUES ($1, $2, $3, $4, $5)',
        [order.id, order.orderNumber, order.customerName, order.resiNumber, order.createdAt]
      );
    }
  }

  async createUser(input: { email: string; passwordHash: string; name: string; role: Role }): Promise<User> {
    const result = await this.pool.query(
      'INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [randomUUID(), input.email, input.passwordHash, input.name, input.role, new Date().toISOString()]
    );
    return mapUserRow(result.rows[0] as Record<string, string>);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE lower(email) = lower($1) LIMIT 1', [email]);
    return result.rowCount ? mapUserRow(result.rows[0] as Record<string, string>) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rowCount ? mapUserRow(result.rows[0] as Record<string, string>) : null;
  }

  async searchTracking(params: TrackingSearchParams): Promise<TrackingSearchResult> {
    const safeSortBy = ['resiNumber', 'status', 'createdAt', 'updatedAt'].includes(params.sortBy) ? params.sortBy : 'createdAt';
    const sortMap: Record<string, string> = {
      resiNumber: 'resi_number',
      status: 'status',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
    const order = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const totalResult = await this.pool.query(
      'SELECT COUNT(*)::int AS total FROM tracking_records WHERE $1 = \'\' OR resi_number ILIKE \'%\' || $1 || \'%\'',
      [params.query]
    );
    const rows = await this.pool.query(
      `SELECT * FROM tracking_records WHERE $1 = '' OR resi_number ILIKE '%' || $1 || '%' ORDER BY ${sortMap[safeSortBy]} ${order}, resi_number ASC LIMIT $2 OFFSET $3`,
      [params.query, params.pageSize, (params.page - 1) * params.pageSize]
    );
    const total = Number(totalResult.rows[0].total);
    return {
      data: rows.rows.map((row) => mapTrackingRow(row as Record<string, string>)),
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: total === 0 ? 0 : Math.ceil(total / params.pageSize)
    };
  }

  async getTrackingByResi(resiNumber: string): Promise<TrackingRecord | null> {
    const result = await this.pool.query('SELECT * FROM tracking_records WHERE resi_number = $1 LIMIT 1', [resiNumber]);
    return result.rowCount ? mapTrackingRow(result.rows[0] as Record<string, string>) : null;
  }

  async listOrders(): Promise<Order[]> {
    const result = await this.pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return result.rows.map((row) => mapOrderRow(row as Record<string, string>));
  }
}

export function createStorage(): AppStorage {
  const config = getConfig();
  if (config.databaseUrl || config.dbHost) {
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
    return new PostgresStorage(pool);
  }

  const dataPath = resolve(dirname(fileURLToPath(import.meta.url)), '../data/app-data.json');
  return new FileStorage(dataPath);
}
