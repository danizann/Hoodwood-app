export interface AppConfig {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl?: string;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
}

export function getConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 5000),
    jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    databaseUrl: process.env.DATABASE_URL || undefined,
    dbHost: process.env.DB_HOST || undefined,
    dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    dbName: process.env.DB_NAME || undefined,
    dbUser: process.env.DB_USER || undefined,
    dbPassword: process.env.DB_PASSWORD || undefined
  };
}
